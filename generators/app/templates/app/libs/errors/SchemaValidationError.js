'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class SchemaValidationError extends AbstractError {

    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = errors.SCHEMA_VALIDATION_ERROR;
        this.status = HTTPStatus.BAD_REQUEST;
    }
}

module.exports = SchemaValidationError;