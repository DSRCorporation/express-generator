'use strict';

const logger = require('winston'),
    config = require('utils/config'),
    mongoose = require('utils/mongoose');

module.exports = async function() {
    let uri = config.get('mongoose:uri'),
        options = config.get('mongoose:options');

    logger.info('Mongoose connecting, uri: %s, options: %s', uri, options);
    await mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
    logger.info('Mongoose connecting -> done');
};
