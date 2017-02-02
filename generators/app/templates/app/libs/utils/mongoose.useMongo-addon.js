'use strict';

/**
 * Configured promisified mongoose instance.
 */

const mongoose = require('mongoose'),
    Promise = require('utils/promise').Promise;

mongoose.Promise = Promise;

module.exports = mongoose;