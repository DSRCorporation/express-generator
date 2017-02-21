'use strict';

const storageConfig = require('utils/config').get('storage:config'),
    fs = require('utils/fs'),
    path = require('path');

async function saveAsync(buffer, relativePath) {
    await fs.outputFileAsync(path.join(__dirname, '..', '..', storageConfig.basePath, relativePath), buffer);
    return relativePath;
}

module.exports = {
    saveAsync
};