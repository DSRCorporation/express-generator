'use strict';

const Promise = require('utils/promise').Promise;


/**
 * Returns promise that resolves after configured time
 * @param ms time to waite before resolve
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

/**
 * Executes coroutine configured times before first success. If no success latest error throw.
 * @param coroutine coroutine to execute
 * @param params coroutine params
 * @param times attempts count
 * @param sleepTime sleep time in ms between attempts
 * @returns {*}
 */
async function attempt(coroutine, params, times, sleepTime) {

    let latestError;

    while (times) {

        try {
            return await coroutine(params);
        } catch (error) {
            logger.debug('common.attempt -> coroutine error', times, error);
            times--;
            latestError = error;
        }

        if (sleepTime) {
            await sleep(sleepTime);
        }
    }

    logger.debug('common.attempt -> coroutine latest error', latestError);
    throw latestError;
}

module.exports = {
    sleep: sleep,
    attempt: attempt
};