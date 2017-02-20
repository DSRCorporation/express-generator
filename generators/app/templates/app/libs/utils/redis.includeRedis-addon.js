'use strict';

const promise = require('utils/promise'),
    _ = require('lodash'),
    logger = require('utils/logger').utils,
    redisConfig = require('utils/config').get('redis'),
    redis = require('redis');

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

function createClient() {
    return redis.createClient(_.merge(redisConfig, {retry_strategy: retryStrategy}));
}

function retryStrategy(options) {
    let attempt = options.attempt,
        maxAttempts  = redisConfig.options.reconnect.maxAttempts;

    logger.error(`redis.retryStrategy -> Trying to reconnect. Attempt ${attempt}`);
    if (attempt < maxAttempts) {
        return redisConfig.options.reconnect.timeout;
    }
    return new errors.InternalServerError(`redis.retryStrategy -> Reconnecting failed after ${maxAttempts} attempts.`,  logger);
}

module.exports ={
    client: createClient(),
    pubSubClient: createClient()
};