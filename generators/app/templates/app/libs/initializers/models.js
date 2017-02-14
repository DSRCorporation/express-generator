'use strict';

const logger = require('utils/logger').app;

module.exports = async () => {
    logger.info('Models initialize');

    require('models');

    logger.info('Models initialize -> done');
};
