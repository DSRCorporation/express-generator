'use strict';
<% if (locals.useMongo) {%>
const mongoose = require('utils/mongoose');

let catSchema = new mongoose.Schema({
    name: String,
    bossName: String,
    birthDate: Date

});

module.exports = mongoose.model('Cat', catSchema);
<%}%>

<% if (locals.useSequelize) {%>
const sequelize = require('utils/sequelize'),
    Sequelize = require('sequelize');

let catSchema = {
    name: Sequelize.STRING,
    bossName: Sequelize.STRING,
    birthDate: Sequelize.DATE
};
module.exports = sequelize.define('Cat', catSchema);
<%}%>