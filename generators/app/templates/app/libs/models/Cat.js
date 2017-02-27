'use strict';
<%_ if (locals.useMongo) {_%>
const mongoose = require('utils/mongoose');

let catSchema = new mongoose.Schema({
    name: String,
    bossName: String,
    birthDate: Date
});

module.exports = mongoose.model('Cat', catSchema);
<%_}_%>

<%_ if (locals.useSequelize) {_%>
const sequelize = require('utils/sequelize'),
    Sequelize = require('sequelize');

let catSchema = {
    name: Sequelize.STRING,
    bossName: Sequelize.STRING,
    birthDate: Sequelize.DATE
};
module.exports = sequelize.define('Cat', catSchema);
<%_}_%>