'use strict';

const version = require("utils/config").version;

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
