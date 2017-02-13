'use strict';

const helpers = require('utils/helpers');

module.exports = require('utils/module-packer').packModule(__dirname, helpers.toPascalCase);
