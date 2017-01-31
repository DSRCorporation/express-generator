'use strict';

/**
 * Main module. Setups express app, perform initiation phases and start listening.
 */

// Add libs to modules search path
require('app-module-path').addPath(__dirname + '/libs');

const config = require('utils/config'),
    logger = require('utils/logger').express,
    express = require('express');

logger.info('Startup');

var app = express();

app.listen(config.get('express:port'), function () {
    logger.info('Express listen port', config.get('express:port'));
    app.emit('listen');
});

module.exports.getApp = app;