'use strict';

const models = require("models"),
    HTTPStatus = require('http-status'),
    objectValidator = require('utils/object-validator'),
    errors = require('errors'),
    mailer = require('utils/mailer'),
    moment = require('moment'),
    crypto = require('crypto'),
    <%_ if (locals.useSequelize) {_%>
    sequelize = require('utils/sequelize'),
    <%_}_%>
    _ = require('utils/lodash-ext');

/**
 * GET /api/v1/user
 * @param req req
 * @param res res
 */

async function get(req, res) {
    <%_ if (locals.useMongo) {_%>
    let user = await models.User.findById(req.userId);

    if (!user) {
        throw new errors.InternalServerError('No user for request.');
    }

    res.json({
        user: _.pickExt(user, ['id:_id', 'login'])
    });
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
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
    <%_}_%>
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
            verifyLinkExpiration: moment().add(1, 'days').unix(),
            verifyToken: token
        }
    );
    <%_ if (locals.useMongo) {_%>
    let newUser = await models.User.create(req.body);
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    let newUser = await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
                return await models.User.create(req.body, {transaction: t});
            }
        );
    <%_}_%>

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

    <%_ if (locals.useMongo) {_%>
    let user = await models.User.findById(req.userId);

    if (!user) {
        throw new errors.NotFoundError('No user for request.');
    }

    _.assign(user, req.body);
    await user.save();
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
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
    <%_}_%>

    res.status(HTTPStatus.NO_CONTENT).send();
}

/**
 * POST /api/v1/user/verify
 * @param req req
 * @param res res
 */

async function verifyEmail(req, res) {
    <%_ if (locals.useMongo) {_%>
    let user = await models.User.findById(req.body.id);

    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }

    if ((moment().unix() - user.verifyLinkExpiration) > 0) {
        throw new errors.SecurityError('The email verification link has expired.');
    }

    if (user.verifyToken === req.body.token) {
        _.assign(user, {verified: true});
        await user.save();
    }
    else {
        throw new errors.SecurityError('Wrong token.');
    }

    res.status(HTTPStatus.NO_CONTENT).send();
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    let user = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.User.find({
                where: {
                    id : req.body.id
                },
                transaction: t
            });
        }
    );

    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }

    if ((moment().unix() - user.verifyLinkExpiration) > 0) {
        throw new errors.SecurityError('The email verification link has expired.');
    }

    if (user.verifyToken === req.body.token) {
        _.assign(user, {verified: true});
        await user.save();
    }
    else {
        throw new errors.SecurityError('Wrong token.');
    }

    res.status(HTTPStatus.NO_CONTENT).send();
    <%_}_%>
}

/**
 * POST /api/v1/user/getVerifyLink
 * @param req req
 * @param res res
 */

async function getVerifyLink(req, res) {
    <%_ if (locals.useMongo) {_%>
    let user = await models.User.findById(req.body.id),
        token = crypto.randomBytes(100).toString('hex');

    if (!user) {
        throw new errors.NotFoundError('User not found.');
    }

    _.assign(user,
        {
            verified: false,
            verifyLinkExpiration: moment().add(1, 'days').unix(),
            verifyToken: token
        }
    );

    await user.save();
    await mailer.send('new-user', user.email, {login: user.login, token: token, id: user.id});
    res.status(HTTPStatus.NO_CONTENT).send();
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    let user = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.User.find({
                where: {
                    id : req.body.id
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
            verifyLinkExpiration: moment().add(1, 'days').unix(),
            verifyToken: token
        }
    );

    await user.save();
    await mailer.send('new-user', user.email, {login: user.login, token: token, id: user.id});
    res.status(HTTPStatus.NO_CONTENT).send();
    <%_}_%>
}

module.exports = {
    get: get,
    create: create,
    update: update,
    verifyEmail: verifyEmail,
    getVerifyLink: getVerifyLink
};