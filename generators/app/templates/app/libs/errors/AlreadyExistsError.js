'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class AlreadyExistsError extends AbstractError {
    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = errors.ALREADY_EXISTS_ERROR;
        this.status = HTTPStatus.UNPROCESSABLE_ENTITY;
    }
}

module.exports = AlreadyExistsError;