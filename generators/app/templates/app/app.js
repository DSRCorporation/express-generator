'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

require('app-module-path').addPath(__dirname + '/libs');

const app = require('./express-async')(require('express')()),
    logger = require('winston'),
    _ = require('lodash'),
    initializers = _(require('initializers')).forIn(initializer => initializer());

async function main() {

    const port = process.env.PORT || 3000;

    app.listen(port, function () {
        logger.info('Example app listening on port', port);
    });
}

main().catch(error => logger.error('Startup error', error));