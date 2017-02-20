const logger = require('utils/logger').app,
    routes = require('routes');

module.exports = async app => {
    logger.info('Add routes.');
    routes.createRoutes(app.route);
    <% if (locals.ejsSupport) {%>
    routes.createViews(app.route);
    <%}%>
    logger.info('Add routes done.');
};
