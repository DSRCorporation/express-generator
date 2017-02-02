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

module.exports = {
    sleep: sleep,
    toCamelCase: toCamelCase,
    toPascalCase: toPascalCase,
    randomChoice: randomChoice,
    randomInt: randomInt
};