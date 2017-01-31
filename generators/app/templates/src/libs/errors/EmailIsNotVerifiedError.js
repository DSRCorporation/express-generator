'use strict';

const constants = require('utils/config').constants,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class EmailIsNotVerifiedError extends AbstractError {
    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = constants.EMAIL_IS_NOT_VERIFIED_ERROR;
        this.status = HTTPStatus.BAD_REQUEST;
    }
}

module.exports = EmailIsNotVerifiedError;