'use strict';

var logger = require('utils/logger').app,
    config = require('utils/config'),
    redis = require('utils/redis');

var attempts = 50,
    sleepInSeconds = 10;

module.exports = async () => {
    logger.info(
        'Redis connecting, options: %s',
        JSON.stringify(config.get('redis'))
    );

    var redisClient = redis.createClient();
    redisClient.retry_delay = sleepInSeconds * 1000;
    redisClient.retry_backoff = 1;

    var att = 0;

    await new Promise((resolve, reject) =>
        redisClient
            .on('connect', () => {
                logger.info('Redis connecting -> done');
                redisClient.quit();
                resolve();
            })
            .on('error', (err) => {
                logger.error('Redis connecting -> error', err);
                att++;
                if(att >= attempts){
                    logger.error('Redis connecting -> failed after %s attempts', attempts);
                    reject(err);
                    process.exit(1);
                }
            })
    );
};
