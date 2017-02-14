'use strict';

/**
 * Promisified version of fs.
 */

module.exports = require('utils/promise').Promise.promisifyAll(require('fs-extra'));