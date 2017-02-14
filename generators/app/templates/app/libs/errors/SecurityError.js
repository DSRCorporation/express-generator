'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class SecurityError extends AbstractError {
    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = errors.SECURITY_ERROR;
        this.status = HTTPStatus.UNAUTHORIZED;
    }
}

module.exports = SecurityError;