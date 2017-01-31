'use strict';

const constants = require('utils/config').constants,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class NotFoundError extends AbstractError {
    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = constants.NOT_FOUND_ERROR;
        this.status = HTTPStatus.NOT_FOUND;
    }
}

module.exports = NotFoundError;