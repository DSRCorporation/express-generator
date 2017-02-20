'use strict';

const logger = require('utils/logger').app,
    promise = require('utils/promise'),
    redis = require('utils/redis');


module.exports = async () => {
    logger.info('Redis connecting');
    await redis.client.infoAsync();
    await redis.pubSubClient.infoAsync();
    logger.info('Redis connecting -> done');
};