'use strict';

const fs = require('fs'),
    express = require('express'),
    middlwares = require('utils/middlewares'),
    promise = require('utils/promise'),
    errors = require('errors'),
    _ = require('lodash');

/**
 * Creates express compatible route based on route module and route json config path.
 * @param path
 * @returns {*}
 */
function createRoute(path) {

    if (!fs.existsSync(path + '.json')) {
        throw new errors.InternalServerError(
            'No settings module found for route %s', path);
    }

    if (!fs.existsSync(path + '.js')) {
        throw new errors.InternalServerError(
            'No handler module found for route %s', path);
    }

    var router = express.Router(),
        routeConfig = require(path + '.json'),
        routeHandler = require(path + '.js');

    _.each(routeConfig, (methodConfig, methodHandler) => {

        if (!routeHandler[methodHandler]) {
            throw new errors.InternalServerError(
                'Invalid handler [%s] defined for route %s',
                methodHandler, path);
        }

        if (!methodConfig.secured && methodConfig.roles) {
            throw new errors.InternalServerError(
                `Invalid method: ${methodConfig.url}. Method is not secured, but roles are defined`);
        }

        var applyArray = [
            methodConfig.url
        ];

        //Check whether user has a right role for an endpoint
        if (methodConfig.secured) {
            applyArray.push(promise.coMiddleware(middlwares.checkSignedIn));
            applyArray.push(middlwares.checkRoles(methodConfig.roles));
        }

        applyArray.push(middlwares.validateRequest(_fillMethodSchemaDefualts(methodConfig.scheme)));
        applyArray.push(middlwares.logRoute(path, methodHandler));
        applyArray.push(_expresifyHandler(routeHandler[methodHandler]));

        router[methodConfig.method].apply(router, applyArray);
    });

    return router;
}

function _fillMethodSchemaDefualts(schema) {

    var defaultSchema = {
        type: 'object',
        additionalProperties: false,
        properties: {}
    };

    if (!schema) {
        schema = {};
    }

    if (!schema.body) {
        schema.body = defaultSchema;
    }
    if (!schema.query) {
        schema.query = defaultSchema;
    }

    if (!schema.params) {
        schema.params = defaultSchema;
    }

    return schema;
}

function _expresifyHandler(handler) {
    return promise.isGenerator(handler) ? promise.coMiddleware(handler) : handler;
}

module.exports = {
    createRoute: createRoute
};