const config = require('utils/config').get("sequelize"),
    Sequelize = require('sequelize');

module.exports = new Sequelize(config.uri, config.options);