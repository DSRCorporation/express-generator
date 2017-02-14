'use strict';

const jwt = require('jsonwebtoken'),
    config = require('utils/config'),
    jwtSecret = config.get('security:jwtSecret'),
    errors = require('errors'),
    _ = require('lodash');

/**
 * Generates token for the authorized user
 * @param data
 * @returns {*}
 */
function generateToken(data) {
    return new Promise((resolve) => {
        jwt.sign(data, jwtSecret, null, result => {
            resolve(result);
        });
    });
}

/**
 * Decodes data from given token
 * @param data token
 * @returns {*}
 */
function decodeToken(data) {
    return new Promise((resolve, reject) => {
        jwt.verify(data, jwtSecret, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
}

/**
 * parseAuthorizationHeader extract Authorization token from header
 * @param headers request header
 * @return token token
 */
function parseAuthorizationHeader(headers) {

    if (!headers || !headers.authorization) {
        throw new errors.SecurityError('Authorization required.');
    }

    var authorizationHeaders = headers.authorization.split(', ');

    var bearerHeader = _.find(authorizationHeaders, function (val) {
        return val.indexOf('Bearer ') > -1;
    });

    if (!bearerHeader) {
        throw new errors.SecurityError('Authorization required.');
    }

    var token = bearerHeader.replace('Bearer ', '');

    if (!token || !token.length) {
        throw new errors.SecurityError('Authorization required.');
    }

    return token;
}

/**
 * setAuthorizationHeader set token in authorization header
 * @param token jwt token
 * @param res res
 */
function setAuthorizationHeader(token, res) {
    res.set('Authorization', 'Bearer ' + token);
}

module.exports = {
    generateToken: generateToken,
    decodeToken: decodeToken,
    parseAuthorizationHeader: parseAuthorizationHeader,
    setAuthorizationHeader: setAuthorizationHeader
};