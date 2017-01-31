'use strict';

/**
 * Init logger, load logger setting and return wrapper.
 */

const winston = require('winston'),
    path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    config = require('utils/config');

const logDir = path.resolve(__dirname, '../../../logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

_.forEach(config.get('logger'), (val, key) => {
    winston.loggers.add(key, val);
    module.exports[key] = winston.loggers.get(key);
});