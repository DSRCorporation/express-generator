'use strict';

/**
 * Init configuration, load configuration from argv, environment, config.json and return wrapper.
 */

const config = require('nconf')
        .overrides({express: {port: process.env.PORT}, mongoose: {uri: `mongodb://${process.env.MONGOOSE_URI}/<%=dbName%>`}})
        .argv()
        .env()
        .file('environment', __dirname + `/../../config/${process.env.NODE_ENV || (process.env.NODE_ENV = 'development')}.json`)
        .file('defaults', __dirname + '/../../config/defaults.json'),
    version = require(__dirname + '/../../config/version.json').version,
    constants = require(__dirname + '/../../config/constants.json');

/**
 * Returns settings value for the given key
 * @param key
 * @returns {*}
 */
function get(key) {
    return config.get(key);
}

module.exports = {
    version: version,
    constants: constants,
    get: get
};

