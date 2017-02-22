'use strict';

let storageConfig = require('utils/config').get('storage:config'),
    Promise = require('utils/promise'),
    AWS = require('aws-sdk'),
    path = require('path');

const s3 = Promise.promisifyAll(
    new AWS.S3({
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey
    }));

async function saveAsync(buffer, destPath, contentType) {
    await s3.putObjectAsync({
        Bucket: storageConfig.bucket,
        Key: path.join(storageConfig.basePath, destPath),
        Body: buffer,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: contentType
    });

    return destPath;
}

module.exports = {
    saveAsync
};