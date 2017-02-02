const logger = require('winston');
    routes = require('routes');

module.exports = async function(app) {
    logger.info('Add routes.');
    routes.createRoutes(app);
    logger.info('Add routes done.');
};
