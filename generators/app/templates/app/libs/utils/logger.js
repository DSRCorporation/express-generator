'use strict';

/**
 * Init logger, load logger setting and return wrapper.
 */

const winston = require('winston'),
    _ = require('lodash'),
    config = require('utils/config');

_.forEach(config.get('logger'), (val, key) => {
    winston.loggers.add(key, val);
    module.exports[key] = winston.loggers.get(key);
});