'use strict';

const logger = require('winston'),
    config = require('utils/config').get("mongoose"),
    mongoose = require('utils/mongoose');

module.exports = async () => {
    logger.info('Mongoose connecting, uri: %s, options: %s', config.uri, config.options);
    await mongoose.connect(config.uri, config.options);
    logger.info('Mongoose connecting -> done');
};
