'use strict';

const models = require("models"),
    HTTPStatus = require('http-status'),
    objectValidator = require('utils/object-validator'),
    errors = require('errors'),
    <% if (locals.useSequelize) {%>
    sequelize = require('utils/sequelize'),
    <%}%>
    _ = require('utils/lodash-ext');

/**
 * GET /api/v1/users
 * @param req req
 * @param res res
 */

async function list(req, res) {
    <% if (locals.useMongo) {%>
    let users = await models.User.find({});
    res.json({
        users: _.pickArrayExt(users, ['login', '_id'])
    });
    <%}%>
    <% if (locals.useSequelize) {%>
    let users = await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
                return await models.User.findAll({transaction: t});
            }
        );
    res.json({
        users: _.pickArrayExt(users, ['login', 'id'])
    });
    <%}%>
}

/**
 * GET /api/v1/users/:id
 * @param req req
 * @param res res
 */

async function get(req, res) {
    <% if (locals.useMongo) {%>
    let user = await models.User.findById(req.params.id);
    if (!user) {
        throw new errors.NotFoundError('User is not found.', req.params.id);
    }
    res.json({
        user: _.pickExt(user, ['login', '_id'])
    });
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
        throw new errors.NotFoundError('User is not found.', req.params.id);
    }
    res.json({
        user: _.pickExt(user, ['login', 'id'])
    });
    <%}%>
}

/**
 * POST /api/v1/users
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
        .validate();
    //@f:on
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
    res.json({
        id: newUser.id
    });
}

/**
 * PUT /api/v1/users/:id
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
    let user = await models.User.findById(req.params.id);
    if (!user) {
        throw new errors.NotFoundError('User is not found.', req.params.id);
    }
    _.assign(user, req.body);
    await user.save();
    <%}%>
    <% if (locals.useSequelize) {%>
    await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            let user = await models.User.find({
                where: {
                    id : req.params.id
                },
                transaction: t
            });
            if (!user) {
                throw new errors.NotFoundError('User is not found.', req.params.id);
            }
            _.assign(user, req.body);
            await user.save({transaction: t});
        }
    );
    <%}%>

    res.status(HTTPStatus.NO_CONTENT).send();
}

/**
 * DELETE /api/v1/users/:id
 * @param req req
 * @param res res
 */

async function remove(req, res) {
    <% if (locals.useMongo) {%>
    let user = await models.User.findById(req.params.id);
    if (!user) {
        throw new errors.NotFoundError('User is not found.', req.params.id);
    }
    user.remove();
    <%}%>
    <% if (locals.useSequelize) {%>
    await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            let user = await models.User.find({
                where: {
                    id: req.params.id
                },
                transaction: t
            });
            if (!user) {
                throw new errors.NotFoundError('User is not found.', req.params.id);
            }
            await user.destroy({transaction: t});
        }
    );
    <%}%>

    res.status(HTTPStatus.NO_CONTENT).send();
}

module.exports = {
    list: list,
    get: get,
    create: create,
    update: update,
    remove: remove
};