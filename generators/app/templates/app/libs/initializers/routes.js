const logger = require('utils/logger').app;
    routes = require('routes');

module.exports = async app => {
    logger.info('Add routes.');
    routes.createRoutes(app);
    logger.info('Add routes done.');
};
