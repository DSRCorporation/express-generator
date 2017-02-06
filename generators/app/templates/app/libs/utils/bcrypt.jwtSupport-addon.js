'use strict';

/**
 * Promisified version of bcrypt.
 */

module.exports = require('utils/promise').Promise.promisifyAll(require('bcrypt'));