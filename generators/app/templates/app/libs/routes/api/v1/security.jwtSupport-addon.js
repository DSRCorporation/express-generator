'use strict';

const models = require('models'),
    jwt = require('utils/jwt'),
    HTTPStatus = require('http-status'),
    config = require('utils/config'),
    objectValidator = require('utils/object-validator'),
    jwtTokenExpirationTime = config.get('security:jwtTokenExpirationTime'),
    moment = require('moment'),
    errors = require('errors');

/**
 * POST /api/v1/login
 * @param req req
 * @param res res
 */
async function login(req, res) {
    //@f:off
    objectValidator.createValidator(req.body)
        .field('login')
            .isNotEmpty('Login is required.')
        .field('password')
            .isNotEmpty('Password is required.')
        .validate();
    //@f:on
    let user = await models.User.findOne({
        <%_ if (locals.useMongo) {_%>
        login: req.body.login
        <%_}_%>
        <%_ if (locals.useSequelize) {_%>
        where: {login: req.body.login}
        <%_}_%>
    });

    if (!user) {
        throw new errors.SecurityError('Login and password combination is not found.');
    }

    if (!(await user.comparePasswordAsync(req.body.password))) {
        throw new errors.SecurityError('Login and password combination is not found.');
    }

    if (!user.verified) {
        throw new errors.EmailIsNotVerifiedError('Email is not verified.');
    }

    let token = await jwt.generateToken({
        <%_ if (locals.useMongo) {_%>
        userId: user._id,
        <%_}_%>
        <%_ if (locals.useSequelize) {_%>
        userId: user.id,
        <%_}_%>
        expiresIn: moment().unix() + jwtTokenExpirationTime
    });

    jwt.setAuthorizationHeader(token, res);

    res.status(HTTPStatus.OK).send();
}

module.exports = {
    login: login
};
