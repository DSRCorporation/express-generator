'use strict';

const promise = require('utils/promise'),
    _ = require('lodash'),
    logger = require('utils/logger').utils,
    redisConfig = require('utils/config').get('redis'),
    redis = require('redis');

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

function createClient() {
    return redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);
}

module.exports ={
    client: createClient(),
    pubSubClient: createClient()
};