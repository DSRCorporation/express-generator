'use strict';

const logger = require('winston'),
    models = require('models'),
    dictionaries = require('dictionaries'),
    _ = require('lodash');

/**
 * Load dictionaries to database
 */
async function loadDictionaries() {
    for (let dictionary in dictionaries) {
        await _loadDictionary(dictionaries[dictionary]);
    }
}

async function _loadDictionary(dictionary) {
    logger.debug('dictionaries-loader._loadDictionary', dictionary.model);

    if (!(await models[dictionary.model].count())) {
        logger.debug('dictionaries-loader._loadDictionary -> creation', dictionary.model);

        await models[dictionary.model].create(dictionary.entities);

    }

    logger.debug('dictionaries-loader._loadDictionary -> done', dictionary.model);
}

module.exports = {
    loadDictionaries: loadDictionaries
};