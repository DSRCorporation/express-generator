'use strict';

const logger = require('winston'),
    fs = require('fs'),
    path = require('path');

/**
 * Requires all files (instead of index.js) in passed module directory and returns it as assotiated array.
 * @param dirname module dirname
 * @returns {{}}
 */
function packModule(dirname) {
    var classes = {};

    fs
        .readdirSync(dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
        .forEach(file => {
            logger.debug("Require and pack:", path.join(dirname, file));
            classes[path.parse(file).name] = require(path.join(dirname, file))
        });

    return classes;
}

module.exports = {
    packModule: packModule
};