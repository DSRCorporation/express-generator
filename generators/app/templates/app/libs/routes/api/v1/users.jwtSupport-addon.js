'use strict';

const models = require("models"),
    HTTPStatus = require('http-status'),
    <% if (locals.useSequelize) {%>
    sequelize = require('utils/sequelize'),
    <%}%>
_ = require('lodash');

/**
 * GET /api/v1/users
 * @param req req
 * @param res res
 */

async function list(req, res) {
    <% if (locals.useMongo) {%>
    res.json({
        users: await models.User.find({})
    });
    <%}%>
    <% if (locals.useSequelize) {%>
    let users = await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
                return await models.User.findAll({transaction: t});
            }
        );
    res.json({
        users: users
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
    res.json({
        user: await models.User.findById(req.params.id)
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
    res.json({
        user: user
    });
    <%}%>
}

/**
 * POST /api/v1/users
 * @param req req
 * @param res res
 */

async function create(req, res) {
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
    <% if (locals.useMongo) {%>
    let user = await models.User.findById(req.params.id);
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
    <%}%>

    _.assign(user, req.body);

    <% if (locals.useMongo) {%>
        await user.save();
    <%}%>
    <% if (locals.useSequelize) {%>
        await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
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
        await models.User.findByIdAndRemove(req.params.id);
    <%}%>
    <% if (locals.useSequelize) {%>
        await sequelize.transaction(async t => {
                // chain all your queries here. make sure you return them.
                await models.User.destroy({
                    where: {
                        id: req.params.id
                    },
                    transaction: t
                });
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