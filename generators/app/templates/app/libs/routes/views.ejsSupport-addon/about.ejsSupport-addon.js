"use strict";

const models = require("models"),
    <%_ if (locals.useSequelize) {_%>
    sequelize = require('utils/sequelize'),
    <%_}_%>
_ = require('utils/lodash-ext');

async function getCats() {
    <%_ if (locals.useMongo) {_%>
    let cats = await models.Cat.find({});

    return _.pickArrayExt(cats, ['name', 'bossName', 'birthDate']);
    <%_}_%>
    <%_ if (locals.useSequelize) {_%>
    let cats = await sequelize.transaction(async t => {
            // chain all your queries here. make sure you return them.
            return await models.Cat.findAll({transaction: t});
        }
    );

    return _.pickArrayExt(cats, ['name', 'bossName', 'birthDate']);
    <%_}_%>
}

async function get(req, res) {
    res.render('about', {
        title: req.__mf('Cats page'),
        message: req.__mf('All we have are cats'),
        cats: await getCats()
    });
}

module.exports = {
  get: get
};