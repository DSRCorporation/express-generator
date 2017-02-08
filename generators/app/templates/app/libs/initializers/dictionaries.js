'use strict';

var dictionariesLoader = require('utils/dictionaries-loader'),
    logger = require('utils/logger').app;

module.exports = async function() {
    logger.info("Load dictionaries");
    await dictionariesLoader.loadDictionaries();
    logger.info("Load dictionaries -> done");
};