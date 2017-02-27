'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

require('app-module-path').addPath(__dirname + '/libs');

const app = require('express')(),
    logger = require('utils/logger').app,
    config = require('utils/config'),
    initializers = require('initializers');

async function main() {

    // Execute initializers
    <%_ if (locals.useMongo) {_%>
    await initializers.mongoose(app);
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    await initializers.sequelize(app);
    <%_}_%>
    <%_ if (locals.includeRedis) {_%>
    await initializers.redis(app);
    <%_}_%>
    await initializers.models(app);
    await initializers.dictionaries(app);
    await initializers.middlewares(app);
    await initializers.routes(app);

    await new Promise((resolve, reject) =>
        app
        .listen(config.get('express:port'), resolve)
        .on('error', reject));

    logger.info('<%= appName%> application listening on port', config.get('express:port'))
}

main().catch(error => logger.error('Startup error', error));