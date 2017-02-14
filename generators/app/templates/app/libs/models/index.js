'use strict';

const _ = require('utils/lodash-ext');

module.exports = require('utils/module-packer').packModule(__dirname, _.toPascalCaseExt);