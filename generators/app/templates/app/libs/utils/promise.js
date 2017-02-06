'use strict';

/*
 * Wrapper over promises libraries
 */

const bluebird = require('bluebird');


/**
 * Converts given function to express compatible middleware
 * @param fn
 * @returns {Function}
 */
function asyncMiddleware(fn) {
    return function (req, res, next) {
        let ret = fn(req, res, next);

        if (ret && ret.catch && ret.then) {
            ret.catch(next);
        }
        return ret;
    }
}

/**
 * Converts given async function to Mongoose compatible hook
 * @param asyncFn
 * @returns {Function}
 */
function asyncHook(asyncFn) {
    // Note: We can't use lamda as this reference is important for Mongoose
    return function (next) {
        asyncFn(this).then(next).catch(next);
    };
}

module.exports = {
    Promise: bluebird.Promise,
    promisifyAll: bluebird.promisifyAll,
    asyncMiddleware: asyncMiddleware,
    asyncHook: asyncHook
};
