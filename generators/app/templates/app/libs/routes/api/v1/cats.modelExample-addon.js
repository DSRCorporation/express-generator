'use strict';

const models = require("models"),
    HTTPStatus = require('http-status'),
    _ = require('lodash');

/**
 * GET /api/v1/cats
 * @param req req
 * @param res res
 */

async function list(req, res) {
    res.json({
        cats: await models.Cat.find({}, 'name')
    });
}

/**
 * GET /api/v1/cats/:id
 * @param req req
 * @param res res
 */

async function get(req, res) {
    res.json({
        cat: await models.Cat.findById(req.params.id, 'name')
    });
}

/**
 * POST /api/v1/cats
 * @param req req
 * @param res res
 */

async function create(req, res) {
    let newCat = await models.Cat.create(req.body);

    res.json({
        id: newCat.id
    });
}

/**
 * PUT /api/v1/cats/:id
 * @param req req
 * @param res res
 */

async function update(req, res) {
    let cat = await models.Cat.findById(req.params.id);

    _.assign(cat, req.body);
    await cat.save();
    res.status(HTTPStatus.NO_CONTENT).send();
}

/**
 * DELETE /api/v1/cats/:id
 * @param req req
 * @param res res
 */

async function remove(req, res) {
    await models.Cat.findByIdAndRemove(req.params.id);

    res.status(HTTPStatus.NO_CONTENT).send();
}

module.exports = {
    list: list,
    get: get,
    create: create,
    update: update,
    remove: remove
};