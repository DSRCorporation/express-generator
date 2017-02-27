'use strict';

/**
 * Loads all routes.
 */

const logger = require('utils/logger').app,
    routeBuilder = require('utils/route-builder'),
    path = require('path'),
    <%_ if (locals.ejsSupport) {_%>
    views = require('routes/views'),
    <%_}_%>
    _ = require('lodash');

function createRoutes(app) {

    //API v1
    const endpoints = [
        {url: '/api/v1/system-info', file: '/api/v1/system-info'},
        <%_ if (locals.jwtSupport) {_%>
        {url: '/api/v1/user', file: '/api/v1/user'},
        <%_}_%>
        <%_ if (locals.jwtSupport) {_%>
        {url: '/api/v1/security', file: '/api/v1/security'},
        <%_}_%>
        <%_ if (locals.includeRedis) {_%>
        {url: '/api/v1/dogs', file: '/api/v1/dogs'},
        <%_}_%>
        {url: '/api/v1/cats', file: '/api/v1/cats'}
    ];

    _(endpoints)
        .each(endpoint => {
            app.use(endpoint.url, routeBuilder.createRoute(path.join(__dirname, endpoint.file)));
            logger.info('Endpoint added:', endpoint.url);
        });
}

<%_ if (locals.ejsSupport) {_%>
function createViews(app) {
    const endpoints = [
        {url: '/about', file: '/views/about'}
    ];

    _(endpoints)
        .each(endpoint => {
            app.use(endpoint.url, routeBuilder.createRoute(path.join(__dirname, endpoint.file)));
            logger.info('Endpoint added:', endpoint.url);
        });
}
<%_}_%>
module.exports = {
    <%_ if (locals.ejsSupport) {_%>
    createViews: createViews,
    <%_}_%>
    createRoutes: createRoutes
};