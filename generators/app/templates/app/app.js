'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

const app = require('./express-async')(require('express')()),
    logger = require('winston');

async function main() {

    const port = process.env.PORT || 3000;

    app.listen(port, function () {
        logger.info('Example app listening on port', port);
    });
}

main().catch(error => logger.error('Startup error', error));