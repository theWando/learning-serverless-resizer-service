'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Jimp = require('jimp');

module.exports = (bucket, key) => {

    const newKey = replacePrefix(key);
    const height = 512;
    return getObject(bucket, key).then(data => resizer(data.Body, height))
        .then(buffer => putObject(bucket, newKey, buffer));
};
function getObject(bucket, key) {
    return S3.getObject({
        Bucket: bucket,
        Key: key
    }).promise();
}

async function putObject(bucket, key, body) {
    const response = await S3.putObject({
        Body: body,
        Bucket: bucket,
        ContentType: 'image/jpg',
        Key: key
    }).promise();
    return response;
}

function replacePrefix(key) {
    const uploadPrefix = 'uploads/';
    const thumbnailsPrefix = 'thumbnails/';
    return key.replace(uploadPrefix, thumbnailsPrefix);
}

function resizer(data, height) {
    return Jimp.read(data)
        .then(image => {
            return image
                .resize(Jimp.AUTO, height)
                .quality(100)
                .getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => err);
}