"use strict";

const models = require("models"),
<% if (locals.useSequelize) {%>
    sequelize = require('utils/sequelize'),
<%}%>
_ = require('utils/lodash-ext');

async function getCats() {
<% if (locals.useMongo) {%>
    let cats = await models.Cat.find({});
    return _.pickArrayExt(cats, ['name', 'bossName', 'birthDate']);
<%}%>
<% if (locals.useSequelize) {%>
    let cats = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.Cat.findAll({transaction: t});
        }
    );
    return _.pickArrayExt(cats, ['name', 'bossName', 'birthDate']);
<%}%>
}

async function getConfig() {
    return {
        title: 'Cats page',
        message: 'All we have are cats',
        cats: await getCats()
    }
}

module.exports = {
  getConfig: getConfig,
  route: '/about'
};