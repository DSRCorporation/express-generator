'use strict';

const promise = require('utils/promise'),
    _ = require('lodash'),
    logger = require('utils/logger').utils,
    redisConfig = require('utils/config').get('redis'),
    redis = require('redis');

const clients = {
    publish: null,
    subscribe: null
};

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

function createClient() {
    return redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);
}

function createMultiClient() {
    return redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options).multi();
}

async function initClients() {
    return await promise.Promise.all(_.map(clients, function(client, clientName) {
        return new promise.Promise((resolve, reject) => {
            let newClient = createClient();

            newClient
                .on('connect', () => {
                    logger.info(`Redis ${clientName} connecting -> done`);
                    clients[clientName] = newClient;
                    resolve(newClient);
                })
                .on('error', (err) => {
                    logger.error(`Redis ${clientName} connecting -> error`, err);
                    reject(err);
                })
        });
    }));
}

module.exports ={
    createClient: createClient,
    createMultiClient: createMultiClient,
    initClients: initClients,
    clients: clients
}