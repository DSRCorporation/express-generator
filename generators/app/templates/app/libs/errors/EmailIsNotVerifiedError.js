'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class EmailIsNotVerifiedError extends AbstractError {
    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = errors.EMAIL_IS_NOT_VERIFIED_ERROR;
        this.status = HTTPStatus.BAD_REQUEST;
    }
}

module.exports = EmailIsNotVerifiedError;