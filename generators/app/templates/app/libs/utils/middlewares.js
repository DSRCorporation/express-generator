'use strict';

const logger = require('utils/logger').utils,
    config = require('utils/config'),
    errors = require('errors'),
    <% if (locals.jwtSupport) {%>jwt = require('utils/jwt'),
    jwtTokenExpirationTime = config.get('security:jwtTokenExpirationTime'),
    models = require('models'),
    jwtTokenReissueTime = config.get('security:jwtTokenReissueTime'),<%}%>
    httpStatus = require('http-status'),
    requestValidator = require('express-jsonschema'),
    moment = require('moment'),
    _ = require('lodash');

/**
 * Use this handler after router to handle page not found cases.
 */
function notFoundHandler(req, res, next) {
    logger.error('middlewares.notFoundHandler');
    next(new errors.NotFoundError());
}

/**
 * Common error handler for express chain.
 */
function errorHandler(err, req, res, next) {

    logger.error('middlewares.errorHandler', err);

    if (res.headersSent) {
        return next(err);
    }

    var errorDetails = {
        code: err.code || config.constants.errors.UNKNOWN_ERROR
    };

    errorDetails.message = err.message;
    errorDetails.fields = err.fields;

    // Convert JsonSchemaValidation to our SchemaValidationError output
    if (err.name === 'JsonSchemaValidation') {
        err.status = httpStatus.BAD_REQUEST;
        errorDetails.code = config.constants.errors.SCHEMA_VALIDATION_ERROR;
        errorDetails.message = err.message + ' ' + JSON.stringify(err.validations);
    }

    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    res.json(errorDetails);
}



/**
 * Request json-scheme checker for express chain.
 */
function validateRequest(scheme) {
    return requestValidator.validate(scheme);
}

/**
 * Logs reqest before passing to main route method.
 */
function logRoute(className, methodName) {
    return (req, res, next) => {
        logger.info('Route:', className, '->', methodName);
        next();
    };
}

/**
 * CORS headers support
 * @param req req
 * @param res res
 * @param next next
 */
function cors(req, res, next) {

    res.set('Access-Control-Allow-Origin', req.get('origin') ? req.get('origin') : '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Pragma, Cache-Control, If-Modified-Since');
    res.set('Access-Control-Expose-Headers', 'Authorization');

    if (req.method === 'OPTIONS') {
        logger.debug('middlewares.cors -> options done');
        return res.sendStatus(httpStatus.OK);
    }

    next();
}

/**
 * checkSignedIn check if user is signed in
 * @param req req
 * @param res res
 * @param next next
 */
async function checkSignedIn(req, res, next) {
    logger.debug('checkSignedIn');

    var token = jwt.parseAuthorizationHeader(req.headers);

    var decodedToken;
    try {
        decodedToken = await jwt.decodeToken(token);
    } catch (err) {
        throw new errors.SecurityError('Authorization required.');
    }

    if (!decodedToken.userId) {
        throw new errors.SecurityError('Incorrect token', decodedToken);
    }

    var tokenLifeTime = decodedToken.expiresIn - moment().unix();

    if (tokenLifeTime < 0) {
        throw new errors.SecurityError('Token expired', decodedToken);
    }

    var newToken =
        tokenLifeTime < jwtTokenReissueTime ?
            await jwt.generateToken(_.assign(_.pick(decodedToken, ['adminId', 'userId']), {expiresIn : moment().unix() + jwtTokenExpirationTime})) :
            token;

    jwt.setAuthorizationHeader(newToken, res);

    req.userId = decodedToken.userId;
    req.user = await models.User.findOne({
        '_id': decodedToken.userId
    });

    next();
}

/**
 * checkRoles checks if user has enough privileges
 */
function checkRoles(requiredRoles) {
    return (req, res, next) => {

        logger.debug('checkRoles. Required:', requiredRoles, 'Available:', req.user.roles);

        if (!requiredRoles.length === 0 || _.intersection(requiredRoles, req.user.roles).length >= 1 ) {
            next();
        } else {
            next(new errors.SecurityError(`Required priveleges: ${requiredRoles}. You have: ${req.user.roles}.`));
        }
    };
}

module.exports = {
    notFoundHandler: notFoundHandler,
    errorHandler: errorHandler,
    validateRequest: validateRequest,
    logRoute: logRoute,
    cors: cors,
    checkSignedIn: checkSignedIn,
    checkRoles: checkRoles
};
