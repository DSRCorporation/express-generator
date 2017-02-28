'use strict';

const i18n = require('i18n'),
    path = require('path');

i18n.configure({
    locales:['en', 'ru'],
    directory: path.join(__dirname, '../locales')
});

module.exports = i18n;