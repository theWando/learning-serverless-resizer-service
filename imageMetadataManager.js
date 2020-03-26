'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient;
const S3 = new AWS.S3();

module.exports.saveImageMetadata = (bucket, key, isAThumbnail) => {
    console.log('saveImageMetadata');

    const image = {};
    image.imageId = getFileName(key, isAThumbnail);
    image.key = key;
    image.bucket = bucket;
    image.imageURL = getSignedUrl(bucket, key);
    image.thumbnails = [];
    image.isAThumbnail = isAThumbnail;

    console.log(image);
    const params = {
        TableName: process.env.IMAGES_DYNAMODB_TABLE,
        Item: image
    };

    return dynamo.put(params).promise();
}

function getImage(imageId) {
    const params = {
        Key: {
            imageId: imageId
        },
        TableName: process.env.IMAGES_DYNAMODB_TABLE
    };

    console.log(params);

    return dynamo.get(params).promise().then(response => {
        return response.Item;
    });
}

function updateImage(imageId, thumbnails) {
    const params = {
        TableName: process.env.IMAGES_DYNAMODB_TABLE,
        Key: { imageId },
        ConditionExpression: 'attribute_exists(imageId)',
        UpdateExpression: 'set thumbnails = :t',
        ExpressionAttributeValues: { ':t': thumbnails },
        ReturnValues: 'ALL_NEW'
    };

    console.log(params);

    return dynamo.update(params).promise().then(response => {
        return response.Attributes;
    });
}

function getSignedUrl(bucket, key) {
    const params =  { Bucket: bucket, Key: key };
    return S3.getSignedUrl('getObject', params);
}

function getFileName(key, isAThumbnail) {
    const textArray = key.split('/');
    let fileName = textArray[1];

    if (isAThumbnail) {
        fileName = `${fileName}_thumbnail`;
    }

    console.log(fileName);

    return fileName;
}