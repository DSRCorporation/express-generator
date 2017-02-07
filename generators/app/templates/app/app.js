'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

require('app-module-path').addPath(__dirname + '/libs');
<% if (!locals.includeRouteBuilder) {%>require('app-module-path').addPath(__dirname + '/libs/routes/api/v1');<%}%>


const app = require('express')(),
    logger = require('winston'),
    config = require('utils/config'),
    initializers = require('initializers');

async function main() {

    // Execute initializers
    <% if (locals.useMongo) {%>await initializers.mongoose(app);<%}%>
    <% if (locals.useSequelize) {%>await initializers.sequelize(app);<%}%>
    await initializers.models(app);
    await initializers.dictionaries(app);

    await initializers.middlewares(app);
    await initializers.routes(app.route);


    app.listen(config.get('express:port'), function () {
        logger.info('Example app listening on port', config.get('express:port'));
    });
}

main().catch(error => logger.error('Startup error', error));