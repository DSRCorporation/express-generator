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
            .isNotEmpty(req.__mf('{value} is required.', {value: req.__mf('Login')}))
        .field('password')
            .isNotEmpty(req.__mf('{value} is required.', {value: req.__mf('Password')}))
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
        throw new errors.SecurityError(req.__mf('{value} is not found.', {value: req.__mf('User')}));
    }

    if (!(await user.comparePasswordAsync(req.body.password))) {
        throw new errors.SecurityError(req.__mf('Login and password combination is not found.'));
    }

    if (!user.verified) {
        throw new errors.EmailIsNotVerifiedError(req.__mf('Email is not verified.'));
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
