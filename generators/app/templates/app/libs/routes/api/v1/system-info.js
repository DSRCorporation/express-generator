'use strict';

const path = require('path'),
    appRoot = path.dirname(require.main.filename),
    version = require(appRoot + '/../package.json').version;

/**
 * GET /api/v1/system-info
 * @param req req
 * @param res res
 */
async function get(req, res) {
    await res.json({
        version: version
    });
}

module.exports = {
    get: get
};
