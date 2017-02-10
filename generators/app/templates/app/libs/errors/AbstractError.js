'use strict';

const errors = require('utils/config').constants.errors,
    HTTPStatus = require('http-status'),
    util = require('util');

class AbstractError extends Error {
    constructor(message, subs) {
        super(message);

        if (this.constructor === AbstractError) {
            throw new TypeError('Abstract class "AbstractClass" cannot be instantiated directly.');
        }

        this.name = this.constructor.name;
        this.message = subs && subs.length ? util.format.apply(util, [message].concat(subs)) : message;
        this.code = errors.UNKNOWN_ERROR;
        this.status = HTTPStatus.INTERNAL_SERVER_ERROR;

        Error.captureStackTrace(this, this.constructor.name);
    }
}

module.exports = AbstractError;