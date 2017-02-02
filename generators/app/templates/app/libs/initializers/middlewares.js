'use strict';

const logger = require('winston'),
    config = require('utils/config').get('express'),
    middlewares = require('utils/middlewares'),
    express = require('express'),
    expressWinston = require('express-winston'),
    bodyParser = require('body-parser'),
    path = require('path');

require('body-parser-xml')(bodyParser);

module.exports = async function (app) {
    logger.info('Setup Express middlewares', config);

    // Disable x-powered-by header
    app.disable('x-powered-by');

    // Common middlewares
    app.use(expressWinston.logger({
        winstonInstance: logger,
        meta: false,
        msg: '{{req.method}} {{req.url}} {{res.statusCode}} - {{res.responseTime}} ms'
    }));
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.xml({limit: '10mb'}));
    app.use(bodyParser.urlencoded({extended: false}));

    // CORS support
    if (config.allowAllOrigins) {
        app.use(middlewares.cors);
    }

    // Static resources handling
    if (config.serveStatic) {
        app.use(config.staticUrl, express.static(path.join(__dirname, '..', '..', config.staticPath)));
    }

    // Routes, will be setup on next phase
    app.route = express.Router();
    app.use(app.route);

    // handle case when route not found by throwing NotFoundError
    app.use(middlewares.notFoundHandler);

    // Error handlers
    app.use(middlewares.errorHandler);

    logger.info('Setup Express middlewares -> done');
};