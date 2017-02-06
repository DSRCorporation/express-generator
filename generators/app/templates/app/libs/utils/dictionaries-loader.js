'use strict';

const logger = require('utils/logger').utils,
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

    <% if (locals.useSequelize) {%>
        await models[dictionary.model].sync();
    <%}%>

    if (!(await models[dictionary.model].count())) {
        logger.debug('dictionaries-loader._loadDictionary -> creation', dictionary.model);
        <% if (locals.useMongo) {%>
            await models[dictionary.model].create(dictionary.entities);
        <%}%>
        <% if (locals.useSequelize){%>
            await models[dictionary.model].bulkCreate(dictionary.entities);
        <%}%>
    }

    logger.debug('dictionaries-loader._loadDictionary -> done', dictionary.model);
}

module.exports = {
    loadDictionaries: loadDictionaries
};