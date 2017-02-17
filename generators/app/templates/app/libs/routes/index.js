'use strict';

/**
 * Loads all routes.
 */

const logger = require('utils/logger').app,
    routeBuilder = require('utils/route-builder'),
    path = require('path'),
    <% if (locals.ejsSupport) {%>
    views = require('routes/views'),
    <%}%>
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

<% if (locals.ejsSupport) {%>
function createViews(app) {
    app.set('views', 'app/views');
    app.set('view engine', 'ejs');
    _.forEach(views, (view, key) => {
        app.route.get(view.route, async function(req, res) {
            res.render(key, await view.getConfig());
        });
    });
}
<%}%>
module.exports = {
    <% if (locals.ejsSupport) {%>
    createViews: createViews,
    <%}%>
    createRoutes: createRoutes
};