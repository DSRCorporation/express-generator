'use strict';

/**
 * Configured promisified mongoose instance.
 */

const mongoose = require('mongoose'),
    bluebird = require('bluebird');

bluebird.Promise.promisifyAll(mongoose.Model);
bluebird.Promise.promisifyAll(mongoose.Model.prototype);
bluebird.Promise.promisifyAll(mongoose.Query.prototype);
bluebird.Promise.promisifyAll(mongoose);

module.exports = mongoose;