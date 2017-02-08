'use strict';

const logger = require('utils/logger').app,
    config = require('utils/config').get("sequelize"),
    sequelize = require('utils/sequelize');

module.exports = async () => {
    logger.info('Sequelize connecting, uri: %s, options: %s', config.uri, config.options);
    await sequelize.authenticate();
    logger.info('Sequelize connecting -> done');
};
