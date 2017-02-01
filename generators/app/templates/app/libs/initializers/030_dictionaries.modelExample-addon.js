'use strict';

var dictionariesLoader = require('utils/dictionaries-loader'),
    logger = require('winston');

module.exports = async () => {
    logger.info("Load dictionaries")
    await dictionariesLoader.loadDictionaries();
    logger.info("Load dictionaries -> done")
};