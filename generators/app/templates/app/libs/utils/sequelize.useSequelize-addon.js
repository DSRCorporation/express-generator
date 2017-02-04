const config = require('utils/config').get("sequelize"),
    Sequelize = require('sequelize'),
    logger = require('winston');

module.exports = new Sequelize(config.postgres.uri, config.postgres.options);