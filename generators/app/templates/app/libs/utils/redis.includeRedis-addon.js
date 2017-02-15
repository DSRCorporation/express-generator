'use strict';

const promise = require('utils/promise'),
    logger = require('utils/logger').utils,
    redisConf = require('utils/config').get('redis'),
    errors = require('errors'),
    _ = require('lodash'),
    redis = require('redis');

promise.promisifyAll(redis.RedisClient.prototype);

async function createClient() {
    return await new Promise(function(resolve) {
        logger.info(`redis.createClient -> Connecting ${redisConf.host}:${redisConf.port}`);
        let client = redis.createClient(_.merge(redisConf, {retry_strategy: retryStrategy}));

        client.on('connect', function() {
            logger.info(`redis.createClient -> Success ${redisConf.host}:${redisConf.port}`);
            resolve(client);
        });
    });
}

function retryStrategy(options) {
    let attempt = options.attempt,
        maxAttempts  = redisConf.reconnect.maxAttempts;

    logger.error(`redis.retryStrategy -> Trying to reconnect. Attempt ${attempt}`);
    if (attempt < maxAttempts) {
        return redisConf.reconnect.timeout;
    }
    return new errors.InternalServerError(`redis.retryStrategy -> Reconnecting failed after ${maxAttempts} attempts.`,
        logger);
}

module.exports = {
    createClient: createClient
};