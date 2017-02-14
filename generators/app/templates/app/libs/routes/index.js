'use strict';

/**
 * Loads all routes.
 */

const logger = require('utils/logger').app,
    routeBuilder = require('utils/route-builder'),
    path = require('path'),
    _ = require('lodash');

function createRoutes(app) {

    //API v1
    const endpoints = [
        {url: '/api/v1/system-info', file: '/api/v1/system-info'},
        <% if (jwtSupport) {%>{url: '/api/v1/user', file: '/api/v1/user'},<%}%>
        <% if (jwtSupport) {%>{url: '/api/v1/security', file: '/api/v1/security'},<%}%>
        {url: '/api/v1/cats', file: '/api/v1/cats'}
    ];

    _(endpoints)
        .each(endpoint => {
            app.use(endpoint.url, routeBuilder.createRoute(path.join(__dirname, endpoint.file)));
            logger.info('Endpoint added:', endpoint.url);
        });
}

module.exports = {
    createRoutes: createRoutes
};