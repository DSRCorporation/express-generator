'use strict';

const objectValidator = require('utils/object-validator'),
    HTTPStatus = require('http-status'),
    client = require('utils/redis').client;

/**
 * GET /api/v1/dogs
 * @param req req
 * @param res res
 */

async function list(req, res) {
    res.json({
        dogs: await client.smembersAsync('dogs')
    });
}

/**
 * POST /api/v1/dogs
 * @param req req
 * @param res res
 */

async function create(req, res) {
    //@f:off
    objectValidator.createValidator(req.body)
        .field('name')
            .isLength(req.__('{{value}} must be from 1 to 255 symbols.', {value: req.__('Name')}), {min: 1, max: 255})
        .validate();
    //@f:on

    await client.saddAsync('dogs', req.body.name);
    res.status(HTTPStatus.NO_CONTENT).send();
}

module.exports = {
    list: list,
    create: create
};