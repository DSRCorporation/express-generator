'use strict';

const logger = require('utils/logger').app,
    redis = require('utils/redis');


module.exports = async function() {
    logger.info('Redis connecting');
    await redis.initClients();
    logger.info('Redis connecting -> done');
};