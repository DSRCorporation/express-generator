'use strict';

const logger = require('utils/logger').utils,
    errors = require('errors'),
    validator = require('validator'),
    mongoose = require('utils/mongoose'),
    _ = require('lodash');

/**
 * Encapsulates validation chain for one object.
 *
 * @class _ValidatorChain
 * @param testObj
 * @constructor
 */
class ValidatorChain {

    /**
     * Constructs new validator chain
     * @param testObj object to validate
     */
    constructor(testObj) {
        this._testObj = testObj;
        this._fieldErrors = [];
        this._fieldProperty = undefined;
        this._fieldOptional = false;
        this._fieldValid = false;
        this._prefixStack = [];
    }

    /**
     * Sets field to chain validators and sanitizers to
     * Example:
     *
     *  objectValidator = require('object-validator');
     *
     *  objectValidator.createValidator(req.body)
     *     .field('vehicleLocation')
     *       .isNotEmpty('Vehicle location is required.')
     *     .validate();
     *
     * @param  {string} property name of field to validate
     * @param optional must be true for optional fields
     * @return {object}
     */

    field(property, optional) {
        if (!property) {
            logger.error('ValidatorChain.field -> is empty');
            throw new errors.InternalServerError('object-validator->ValidatorChain.field is empty');
        }
        this._fieldProperty = property;
        this._fieldValid = true;
        this._fieldOptional = optional || false;

        return this;
    }

    /**
     * Sets field that is array of complex objects to chain validators and sanitizers to inner properties
     * Example:
     *
     *  .array('damages',
     *      validator => validator
     *          .field('damageRegion')
     *              .isNotEmpty('Damage region is required.')
     *          .field('damageType')
     *              .isNotEmpty('Damage type is required.')
     *          .field('coverageType')
     *              .isNotEmpty('Coverage type is required.'))
     * Valid scheme: {'damages': [{
     *                  'damageRegion': 'some region',
     *                  'damageType': 'some type',
     *                  'coverageType': 'some type'}]}
     * @param  {string} property name of array field to validate
     * @param arrayValidator function that validate objects in array
     * @return {object}
     */
    array(property, arrayValidator) {

        if (!property) {
            logger.error('ValidatorChain.array -> is empty');
            throw new errors.InternalServerError('object-validator->ValidatorChain.array is empty');
        }
        _.get(this._testObj, _makePath(this._prefixStack, property)).forEach((item, index) => {
            this._prefixStack.push({name: property, index: index});
            this._fieldProperty = item;
            this._fieldValid = true;
            arrayValidator(this);
            this._prefixStack.pop();
        }, this);

        return this;
    }

    /**
     * Throws ValidationError if chain contains field errors
     *
     * @method validate
     * @param  {string} message error message for ValidationError (don't path for default)
     * @return {object}
     */
    validate(message) {
        if (!_.isEmpty(this._fieldErrors)) {
            logger.debug('ValidatorChain.validate -> invalid', this._fieldErrors);
            throw new errors.ValidationError(message ? message : 'Invalid data found', this._fieldErrors);
        }
    }
}

//additional custom validators
validator.extend('isExist', str => str !== undefined);
validator.extend('isNotEmpty', str => str.length > 0);
validator.extend('isDate', val => val.match(/^[0-9]{4}-(1[0-2]|0[0-9])-([0-2][0-9]|3[0-1])T[0-1][0-9]|2[0-3]:[0-5][0-9]:[0-5][0-9].[0-9]{3}Z$/));
validator.extend('isInteger', val => val.match(/^[0-9]+$/));
validator.extend('isShorterThan', (str, length) => str.length < length);
validator.extend('isBase64Image',
    val => val.match(/data:image\/png;base64,/i) || val.match(/data:image\/jpg;base64,/i) ||
    val.match(/data:image\/jpeg;base64,/i));
validator.extend('isEmail', val => val.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/));
validator.extend('isObjectId', val => mongoose.Types.ObjectId.isValid(val));

// validators and sanitizers not prefixed with is/to
var additionalValidators = ['includes', 'equals', 'matches'];
var additionalSanitizers = ['trim', 'ltrim', 'rtrim', 'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];

// _.set validators and sanitizers as prototype methods on corresponding chains
_.forEach(validator, (method, methodName) => {
    if (methodName.match(/^is/) || _.includes(additionalValidators, methodName)) {
        ValidatorChain.prototype[methodName] = _makeValidator(methodName, validator);
    }

    if (methodName.match(/^to/) || _.includes(additionalSanitizers, methodName)) {
        ValidatorChain.prototype[methodName] = _makeSanitizer(methodName, validator);
    }
});

/**
 * Creates validator/sanitizer for passed object
 * @param testObj
 * @returns {ValidatorChain}
 */
function createValidator(testObj) {
    return new ValidatorChain(testObj);
}

/**
 * Creates field errors in validator format for one custom errors
 * @param field field name
 * @param message errors message
 * @returns {*[]}
 */
function createFieldErrors(field, message) {
    var subs;

    if (arguments.length > 2) {
        subs = Array.prototype.slice.call(arguments, 2);
    }

    return [{
        name: field,
        message: message,
        substitutions: subs ? subs : []
    }];
}

/**
 * Validates and handles errors, return instance of itself to allow for chaining
 *
 * @method _makeValidator
 * @param  {string} methodName
 * @return {function}
 */
function _makeValidator(methodName) {

    return function (message) {

        if (!this._fieldValid) {
            logger.debug('ValidatorChain.field: previous validation failed -> skip validation');
            return this;
        }

        var validatorArgs = [];
        validatorArgs.push(_.get(this._testObj, _makePath(this._prefixStack, this._fieldProperty)) + '');
        validatorArgs = validatorArgs.concat(_.slice(arguments, 1));

        var isValid = (this._fieldOptional &&
            _.get(this._testObj, _makePath(this._prefixStack, this._fieldProperty)) === undefined) ||
            _.get(this._testObj, _makePath(this._prefixStack, this._fieldProperty)) === '' ||
            validator[methodName].apply(validator, validatorArgs);

        if (!isValid) {
            this._fieldErrors.push({name: _makePath(this._prefixStack, this._fieldProperty), message: message});
            this._fieldValid = false;
        }

        return this;
    };
}

/**
 * Modifies field value as required by the rule of the sanitizer, return instance of itself to allow for chaining
 *
 * @method _makeSanitizer
 * @param  {string}          methodName
 * @return {function}
 */

function _makeSanitizer(methodName) {

    return function () {

        if (!this._fieldValid) {
            return this;
        }
        if (this._fieldOptional && _.get(this._testObj, _makePath(this._prefixStack, this._fieldProperty)) === undefined) {
            return this;
        }

        var validatorArgs = [];
        validatorArgs.push(_.get(this._testObj, _makePath(this._prefixStack, this._fieldProperty)));
        validatorArgs = validatorArgs.concat(arguments);

        try {
            _.set(this._testObj, _makePath(this._prefixStack, this._fieldProperty),
                validator[methodName].apply(validator, validatorArgs));
        }
        catch (error) {
            logger.debug('ValidatorChain.%s: sanitizer -> errors', methodName, error);
            throw new errors.InternalServerError(error);
        }

        return this;
    };
}

/**
 * Iterates throw prefixStack, concat elements adding '.' as delimiter, and add field name to result
 *
 * @method _makePath
 * @param  {Array} prefixStack
 * @param  {string} fieldName
 * @return {string} absolute path to given field
 */

function _makePath(prefixStack, fieldName) {
    let prefix = _.reduce(prefixStack, (result, item) => result += item.name + '[' + item.index + '].', '');
    return prefix + fieldName;
}

module.exports = {
    createValidator: createValidator,
    createFieldErrors: createFieldErrors
};

