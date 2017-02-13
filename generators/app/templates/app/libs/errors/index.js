'use strict';

const _ = require('utils/lodash-ext')._;

module.exports = require('utils/module-packer').packModule(__dirname, _.toPascalCase);
