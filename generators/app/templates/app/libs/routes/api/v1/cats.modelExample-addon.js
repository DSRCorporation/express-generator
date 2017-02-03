'use strict';

const models = require("models");

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

module.exports = {
    list: list,
    get: get,
    create: create
};