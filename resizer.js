"use strict";

const AWS = require("aws-sdk");
const S3 = new AWS.S3();

const Jimp = require('jimp')

function replacePrefix(key) {
    const uploadPrefix = 'uploads/';
    const thumbnailsPrefix = 'thumbnails/';
    return key.replace(uploadPrefix, thumbnailsPrefix);
}

module.exports = (bucket, key) => {
    
    const newKey = replacePrefix(key);
    const height = 512;
    return getObject(bucket, key).then(data => resizer(data.Body, height))
        .then(buffer => putObject(bucket, newKey, buffer));
}
function getObject(bucket, key) {
    return S3.getObject({
        Bucket: bucket,
        Key: key
    }).promise();
}

function putObject(bucket, key, body) {
    return S3.putObject({
        Body: body,
        Bucket: bucket,
        ContentType: 'image/jpg',
        Key: key
    }).promise()
}

function resizer(data, height) {
    return Jimp.read(data)
        .then(image => {
            return image
                .resize(Jimp.AUTO, height)
                .quality(100)
                .getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
                    return buffer;
                })
        })
        .catch(err => err);
}