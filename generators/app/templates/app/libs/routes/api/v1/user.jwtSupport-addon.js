'use strict';

const models = require("models"),
    HTTPStatus = require('http-status'),
    objectValidator = require('utils/object-validator'),
    errors = require('errors'),
    mailer = require('utils/mailer'),
    moment = require('moment'),
    crypto = require('crypto'),
    <% if (locals.useSequelize) {%>
    sequelize = require('utils/sequelize'),
    <%}%>
    _ = require('utils/lodash-ext');

/**
 * GET /api/v1/user
 * @param req req
 * @param res res
 */

async function get(req, res) {
    <% if (locals.useMongo) {%>
    let user = await models.User.findById(req.userId);
    if (!user) {
        throw new errors.InternalServerError('No user for request.');
    }
    res.json({
        user: _.pickExt(user, ['id:_id', 'login'])
    });
    <%}%>
    <% if (locals.useSequelize) {%>
    let user = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.User.find({
                where: {
                    id : req.userId
                },
                transaction: t
            });
        }
    );
    if (!user) {
        throw new errors.NotFoundError('No user for request.');
    }
    res.json({
        user: _.pickExt(user, ['login', 'id'])
    });
    <%}%>
}

/**
 * POST /api/v1/user
 * @param req req
 * @param res res
 */

async function create(req, res) {
    //@f:off
    objectValidator.createValidator(req.body)
        .field('login')
            .isLength('Login must be from 1 to 255 symbols.', {min: 1, max: 255})
        .field('password')
            .isLength('Password must be from 1 to 255 symbols.', {min: 1, max: 255})
        .field('email')
            .isLength('Email field must be from 1 to 255 symbols.', {min: 1, max: 255})
            .isEmail('Please provide valid e-mail.')
            .normalizeEmail({
                lowercase: true,
                remove_dots: false,
                remove_extension: false
            })
        .validate();
    //@f:on
    let token = crypto.randomBytes(100).toString('hex');

    _.assign(req.body,
        {
            verified: false,
            verifyLink: {
                token: token,
                expired: moment().add('days', 1)
            }
        }
    );
    <% if (locals.useMongo) {%>
    let newUser = await models.User.create(req.body);
    <%}%>
    <% if (locals.useSequelize) {%>
    let newUser = await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
                return await models.User.create(req.body, {transaction: t});
            }
        );
    <%}%>
    await mailer.send('new-user', newUser.email, {login: newUser.login, token: token, id: newUser.id});
    res.json({
        id: newUser.id
    });
}

/**
 * PUT /api/v1/user
 * @param req req
 * @param res res
 */

async function update(req, res) {
    //@f:off
    objectValidator.createValidator(req.body)
        .field('password')
            .isLength('Password must be from 1 to 255 symbols.', {min: 1, max: 255})
        .validate();
    //@f:on
    <% if (locals.useMongo) {%>
    let user = await models.User.findById(req.userId);
    if (!user) {
        throw new errors.NotFoundError('No user for request.');
    }
    _.assign(user, req.body);
    await user.save();
    <%}%>
    <% if (locals.useSequelize) {%>
    await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            let user = await models.User.find({
                where: {
                    id : req.userId
                },
                transaction: t
            });
            if (!user) {
                throw new errors.NotFoundError('No user for request.');
            }
            _.assign(user, req.body);
            await user.save({transaction: t});
        }
    );
    <%}%>

    res.status(HTTPStatus.NO_CONTENT).send();
}

/**
 * GET /api/v1/user/:id/verify
 * @param req req
 * @param res res
 */

async function verifyEmail(req, res) {
<% if (locals.useMongo) {%>
    let user = await models.User.findById(req.params.id);
    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }
    if ((moment() - req.query.token) > 0) {
        throw new errors.SecurityError('The email verification link has expired.');
    }
    _.assign(user, {verified: true});
    await user.save();
    res.status(HTTPStatus.NO_CONTENT).send();
<%}%>
<% if (locals.useSequelize) {%>
    let user = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.User.find({
                where: {
                    id : req.params.id
                },
                transaction: t
            });
        }
    );
    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }
    if ((moment() - req.query.token) > 0) {
        throw new errors.SecurityError('The email verification link has expired.');
    }
    _.assign(user, {verified: true});
    await user.save();
    res.status(HTTPStatus.NO_CONTENT).send();
<%}%>
}

/**
 * GET /api/v1/user/:id/getVerifyLink
 * @param req req
 * @param res res
 */

async function getVerifyLink(req, res) {
<% if (locals.useMongo) {%>
    let user = await models.User.findById(req.params.id),
        token = crypto.randomBytes(100).toString('hex');
    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }

    _.assign(user,
        {
            verified: false,
            verifyLink: {
                token: token,
                expired: moment().add('days', 1)
            }
        }
    );
    await user.save();
    await mailer.send('new-user', user.email, {login: user.login, token: token, id: user.id});
    res.status(HTTPStatus.NO_CONTENT).send();
<%}%>
<% if (locals.useSequelize) {%>
    let user = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.User.find({
                where: {
                    id : req.params.id
                },
                transaction: t
            });
        }
    );
    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }
    let token = crypto.randomBytes(100).toString('hex');

    _.assign(user,
        {
            verified: false,
            verifyLink: {
                token: token,
                expired: moment().add('days', 1)
            }
        }
    );
    await user.save();
    await mailer.send('new-user', user.email, {login: user.login, token: token, id: user.id});
    res.status(HTTPStatus.NO_CONTENT).send();
<%}%>
}

module.exports = {
    get: get,
    create: create,
    update: update,
    verifyEmail: verifyEmail,
    getVerifyLink: getVerifyLink
};