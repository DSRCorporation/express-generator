'use strict';

const logger = require('winston'),
    fs = require('fs'),
    helpers = require('utils/helpers'),
    path = require('path');

/**
 * Requires all files (instead of index.js) in passed module directory and returns it as assotiated array.
 * @param dirname module dirname
 * @param transformFn file name transformation function
 * @returns {{}}
 */
function packModule(dirname, transformFn = helpers.toCamelCase) {
    var classes = {};

    fs
        .readdirSync(dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
        .forEach(file => classes[transformFn(path.parse(file).name)] = require(path.join(dirname, file)));
    return classes;
}

module.exports = {
    packModule: packModule
};