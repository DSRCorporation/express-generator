'use strict';

const fs = require('fs'),
    express = require('express'),
    middlewares = require('utils/middlewares'),
    asyncMiddleware = require('utils/promise').asyncMiddleware,
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

        let applyArray = [
            methodConfig.url
        ],
            middlewaresArray = [
                {
                    fn: middlewares.checkSignedIn,
                    apply: methodConfig.secured
                },
                {
                    fn: middlewares.validateRequest(_fillMethodSchemaDefaults(methodConfig.scheme)),
                    apply: true
                },
                {
                    fn: middlewares.logRoute(path, methodHandler),
                    apply: true
                },
                {
                    fn: routeHandler[methodHandler],
                    apply: true
                }
            ];

        middlewaresArray.forEach(middleware => middleware.apply ? applyArray.push(asyncMiddleware(middleware.fn)) : null);

        router[methodConfig.method].apply(router, applyArray);
    });

    return router;
}

function _fillMethodSchemaDefaults(schema) {

    let defaultSchema = {
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

module.exports = {
    createRoute: createRoute
};