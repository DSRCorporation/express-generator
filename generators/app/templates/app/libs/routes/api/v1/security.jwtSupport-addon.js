'use strict';

const models = require('models'),
    jwt = require('utils/jwt'),
    HTTPStatus = require('http-status'),
    config = require('utils/config'),
    jwtTokenExpirationTime = config.get('express:jwtTokenExpirationTime'),
    moment = require('moment'),
    errors = require('errors');

/**
 * POST /api/v1/login
 * @param req req
 * @param res res
 */
async function login(req, res) {

    let user = await models.User.findOne({
        login: req.body.login
    });

    if (!user) {
        throw new errors.SecurityError('Login and password combination is not found.');
    }

    if (!(await user.comparePasswordAsync(req.body.password))) {
        throw new errors.SecurityError('Login and password combination is not found.');
    }

    let token = await jwt.generateToken({
        userId: user._id,
        expiresIn: moment().unix() + jwtTokenExpirationTime
    });

    jwt.setAuthorizationHeader(token, res);

    res.status(HTTPStatus.OK).send();
}

module.exports = {
    login: login
};
