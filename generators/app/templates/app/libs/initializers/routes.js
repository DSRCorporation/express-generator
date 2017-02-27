const logger = require('utils/logger').app,
    routes = require('routes');

module.exports = async app => {
    logger.info('Add routes.');
    routes.createRoutes(app.route);
    <%_ if (locals.ejsSupport) {_%>
    routes.createViews(app.route);
    <%_}_%>
    logger.info('Add routes done.');
};
