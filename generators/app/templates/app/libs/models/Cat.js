'use strict';
<% if (locals.useMongo) {%>
const mongoose = require('utils/mongoose');

let catSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Cat', catSchema);
<%}%>

<% if (locals.usePostgres) {%>
const sequelize = require('utils/sequelize'),
    Sequelize = require('sequelize');

    let catSchema = {
        name: Sequelize.STRING
    },
    catModel = sequelize.define('Cat', catSchema);
    catModel.sync({force: true});
module.exports = catModel;
<%}%>