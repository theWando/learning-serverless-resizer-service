'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Jimp = require('jimp');

module.exports.resize = (bucket, key) => {

    const newKey = replacePrefix(key, 'thumbnails/');
    const height = 512;
    return getObject(bucket, key).then(data => resizer(data.Body, height))
        .then(buffer => putObject(bucket, newKey, buffer));
};

module.exports.blackAndWhiteCrop = (bucket, key) => {
    const newKey = replacePrefix(key, 'thumbnails/crop_');
    const height = 512;

    return getObject(bucket, key).then(data => blackAndWhiteCrop(data.Body, height))
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

function replacePrefix(key, thumbnailsPrefix) {
    const uploadPrefix = 'uploads/';
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

function blackAndWhiteCrop(data, height) {
    return Jimp.read(data)
        .then(image => {
            return image
                .resize(height, height)
                .quality(100)
                .grayscale()
                .getBufferAsync(Jimp.MIME_JPEG);
        })
        .catch(err => err);
}