'use strict';

/**
 * Loads all routes.
 */

const logger = require('winston'),
    <% if (locals.includeRouteBuilder) {%>
        routeBuilder = require('utils/route-builder'),
    <%} else {%>
    asyncMiddleware = require('utils/promise').asyncMiddleware,
    middlewares = require('utils/middlewares'),
    express = require('express'),<%}%>
    path = require('path'),
    _ = require('lodash');

function createRoutes(app) {
    <% if (locals.includeRouteBuilder) {%>
        //API v1
        const endpoints = [
            {url: '/api/v1/system-info', file: '/api/v1/system-info'},
            <% if (jwtSupport) {%>{url: '/api/v1/users', file: '/api/v1/users'},<%}%>
            <% if (jwtSupport) {%>{url: '/api/v1/security', file: '/api/v1/security'},<%}%>
            {url: '/api/v1/cats', file: '/api/v1/cats'}
        ];

        _(endpoints)
            .each(endpoint => {
                app.use(endpoint.url, routeBuilder.createRoute(path.join(__dirname, endpoint.file)));
                logger.info('Endpoint added:', endpoint.url);
            });
    <%} else {%>
        logger.info("createRoutes");
        let systemInfoHandler = require('system-info.js'),
            systemInfoRouter = express.Router(),
            catsConfig = require('cats.json'),
            catsHandler = require('cats.js'),
            catsRouter = express.Router();

        //system-info
        systemInfoRouter.get('/', middlewares.logRoute('system-info', 'get'), asyncMiddleware(systemInfoHandler.get));
        app.use('/api/v1/system-info', systemInfoRouter);
        //system-info end

        //cats
        catsRouter.get('/', middlewares.logRoute('cats', 'list'), asyncMiddleware(catsHandler.list));
        catsRouter.get('/:id',
            middlewares.logRoute('cats', 'get'),
            middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.get.scheme)),
            asyncMiddleware(catsHandler.get)
        );
        catsRouter.post('/',
            middlewares.logRoute('cats', 'create'),
            middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.create.scheme)),
            asyncMiddleware(catsHandler.create)
        );
        catsRouter.put('/:id',
            middlewares.logRoute('cats', 'update'),
            middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.update.scheme)),
            asyncMiddleware(catsHandler.update)
        );
        catsRouter.delete('/:id',
            middlewares.logRoute('cats', 'remove'),
            middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.remove.scheme)),
            asyncMiddleware(catsHandler.remove)
        );
        app.use('/api/v1/cats', catsRouter);
        //cats end
        logger.info("createRoutes -> done.");
    <%}%>
}

module.exports = {
    createRoutes: createRoutes
};