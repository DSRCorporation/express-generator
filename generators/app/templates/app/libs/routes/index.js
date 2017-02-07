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
            <% if (locals.jwtSupport) {%>{url: '/api/v1/users', file: '/api/v1/users'},<%}%>
            <% if (locals.jwtSupport) {%>{url: '/api/v1/security', file: '/api/v1/security'},<%}%>
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
        systemInfoRouter.get('/', asyncMiddleware(middlewares.logRoute('system-info', 'get')), asyncMiddleware(systemInfoHandler.get));
        app.use('/api/v1/system-info', systemInfoRouter);
        //system-info end

        //cats
        catsRouter.get('/', asyncMiddleware(middlewares.logRoute('cats', 'list')), asyncMiddleware(catsHandler.list));
        catsRouter.get('/:id',
            asyncMiddleware(middlewares.logRoute('cats', 'get')),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.get.scheme))),
            asyncMiddleware(catsHandler.get)
        );
        catsRouter.post('/',
            asyncMiddleware(middlewares.logRoute('cats', 'create')),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.create.scheme))),
            asyncMiddleware(catsHandler.create)
        );
        catsRouter.put('/:id',
            asyncMiddleware(middlewares.logRoute('cats', 'update')),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.update.scheme))),
            asyncMiddleware(catsHandler.update)
        );
        catsRouter.delete('/:id',
            asyncMiddleware(middlewares.logRoute('cats', 'remove')),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(catsConfig.remove.scheme))),
            asyncMiddleware(catsHandler.remove)
        );
        app.use('/api/v1/cats', catsRouter);
        //cats end
        <% if (locals.jwtSupport) {%>
        // security
        let securityConfig = require('security.json'),
            securityHandler = require('security.js'),
            securityRouter = express.Router();

        securityRouter.post('/login',
            asyncMiddleware(middlewares.logRoute('security/login', 'login')),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(securityConfig.login.scheme))),
            asyncMiddleware(securityHandler.login)
        );
        app.use('/api/v1/security', securityRouter);
        // security end
        // users
        let usersConfig = require('users.json'),
            usersHandler = require('users.js'),
            usersRouter = express.Router();

        usersRouter.get('/',
            asyncMiddleware(middlewares.logRoute('users', 'list')),
            asyncMiddleware(middlewares.checkSignedIn),
            asyncMiddleware(usersHandler.list));
        usersRouter.get('/:id',
            asyncMiddleware(middlewares.logRoute('users', 'get')),
            asyncMiddleware(middlewares.checkSignedIn),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(usersConfig.get.scheme))),
            asyncMiddleware(usersHandler.get)
        );
        usersRouter.post('/',
            asyncMiddleware(middlewares.logRoute('users', 'create')),
            asyncMiddleware(middlewares.checkSignedIn),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(usersConfig.create.scheme))),
            asyncMiddleware(usersHandler.create)
        );
        usersRouter.put('/:id',
            asyncMiddleware(middlewares.logRoute('users', 'update')),
            asyncMiddleware(middlewares.checkSignedIn),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(usersConfig.update.scheme))),
            asyncMiddleware(usersHandler.update)
        );
        usersRouter.delete('/:id',
            asyncMiddleware(middlewares.logRoute('users', 'remove')),
            asyncMiddleware(middlewares.checkSignedIn),
            asyncMiddleware(middlewares.validateRequest(middlewares.fillMethodSchemaDefaults(usersConfig.remove.scheme))),
            asyncMiddleware(usersHandler.remove)
        );
        app.use('/api/v1/users', usersRouter);
        // users end
        <%}%>
        logger.info("createRoutes -> done.");
    <%}%>
}

module.exports = {
    createRoutes: createRoutes
};