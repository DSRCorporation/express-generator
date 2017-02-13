'use strict';

const Promise = require('utils/promise').Promise;


async function sleep(timeout) {
    return await new Promise(resolve => setTimeout(resolve, timeout));
}

function toCamelCase(string) {
    return string.split('-').map((val, i) => i ? val.charAt(0).toUpperCase() + val.slice(1) : val).join('');
}

function toPascalCase(string) {
    return string.split('-').map(val => val.charAt(0).toUpperCase() + val.slice(1)).join('');
}

function randomChoice(list) {
    return Math.trunc(Math.random() * list.length);
}

function randomInt(range = 1000000) {
    return Math.trunc(Math.random() * range);
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
    attempt: attempt,
    toCamelCase: toCamelCase,
    toPascalCase: toPascalCase,
    randomChoice: randomChoice,
    randomInt: randomInt
};