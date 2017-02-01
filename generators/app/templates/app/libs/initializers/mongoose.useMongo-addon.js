'use strict';

const logger = require('winston'),
    config = require('utils/config'),
    mongoose = require('utils/mongoose'),
    autoIncrement = require('mongoose-auto-increment');

module.exports = async () => {
    logger.info(
        'Mongoose connecting, uri: %s, options: %s',
        config.get('mongoose:uri'),
        config.get('mongoose:options')
    );

    await mongoose.connectAsync(config.get('mongoose:uri'), config.get('mongoose:options'));

    autoIncrement.initialize(mongoose.connection);

    logger.info('Mongoose connecting -> done');
};
