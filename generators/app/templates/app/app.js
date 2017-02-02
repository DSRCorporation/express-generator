'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

require('app-module-path').addPath(__dirname + '/libs');

const app = require('express')(),
    logger = require('winston'),
    _ = require('lodash'),
    initializers = require('initializers');

async function main() {

    // Execute initializers
    <% if (useMongo) {%>await initializers.mongoose(app);<%}%>
    <% if (modelExample) {%>await initializers.models(app);<%}%>
    <% if (modelExample) {%>await initializers.dictionaries(app);<%}%>
    await initializers.routes(app);

    const port = 3000;

    app.listen(port, function () {
        logger.info('Example app listening on port', port);
    });
}

main().catch(error => logger.error('Startup error', error));