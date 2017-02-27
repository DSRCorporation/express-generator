'use strict';

const storageConfig = require('utils/config').get('storage'),
    handler = require('utils/storage-helpers-' + storageConfig.type),
    errors = require('errors');

async function saveDataUrlAsync(dataUrl, path) {
    let ext = dataUrl.match(/data:image\/(.*);/);

    if (!ext || !ext[1]) {
        throw new InternalServerError('Invalid dataUrl format. Image extention not found.');
    }

    return await saveAsync(
        new Buffer(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64'), `${path}.${ext[1]}`, `image/${ext[1]}`);
}

async function saveAsync(buffer, path, contentType) {
    return await handler.saveAsync(buffer, path, contentType);
}

module.exports = {
    saveAsync,
    saveDataUrlAsync
};