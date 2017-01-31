'use strict';

const constants = require('utils/config').constants,
    HTTPStatus = require('http-status'),
    AbstractError = require('errors/AbstractError');

class InternalServerError extends AbstractError {

    constructor(message) {
        super(message, Array.prototype.slice.call(arguments, 1));

        this.code = constants.INTERNAL_SERVER_ERROR;
        this.status = HTTPStatus.INTERNAL_SERVER_ERROR;
    }
}

module.exports = InternalServerError;