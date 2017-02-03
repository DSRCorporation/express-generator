'use strict';

const logger = require('winston');

module.exports = async () => {
    logger.info('Models initialize');

    require('models');

    logger.info('Models initialize -> done');
};
