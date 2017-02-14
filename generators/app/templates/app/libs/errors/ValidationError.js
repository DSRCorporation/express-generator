'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class ValidationError extends AbstractError {
    constructor(message, fields) {
        super(message, Array.prototype.slice.call(arguments, 2));

        this.fields = fields ? fields : [];
        this.code = errors.VALIDATION_ERROR;
        this.status = HTTPStatus.BAD_REQUEST;
    }
}

module.exports = ValidationError;