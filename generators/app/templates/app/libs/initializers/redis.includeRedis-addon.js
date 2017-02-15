'use strict';

const logger = require('utils/logger').app,
    redis = require('utils/redis');


module.exports = async function() {
    logger.info('Redis connecting');
    await redis.createClient();
    logger.info('Redis connecting -> done');
};