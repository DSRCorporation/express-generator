'use strict';

const models = require("models");

/**
 * GET /api/v1/cats
 * @param req req
 * @param res res
 */

async function list(req, res) {
    res.json({
        cats: await models.Cat.findAsync({}, 'name')
    });
}

module.exports = {
    list: list
};