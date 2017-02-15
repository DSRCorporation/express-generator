'use strict';

/**
 * Configured redis instance.
 */

var config = require('utils/config').get('redis'),
    redis = require('redis'),
    BPromise = require('bluebird');

module.exports.createClient = function () {
    var client = redis.createClient(config.port, config.host, config.options);
    BPromise.promisifyAll(client);
    return client;
};

module.exports.createMultiClient = function () {
    var client = redis.createClient(config.port, config.host, config.options);
    client = client.multi();
    BPromise.promisifyAll(client);
    return client;
};

