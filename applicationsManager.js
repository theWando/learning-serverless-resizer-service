"use strict";

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient;

const table = process.env.APPS_ID_DYNAMODB_TABLE;

module.exports.create = (credentials) => {
    console.log('create');
    const item = {
        applicationId: credentials.applicationId,
        applicationSecret: credentials.applicationSecret
    };

    console.log(item)
    const params = {
        TableName: table,
        Item: item
    }

    return dynamo.put(params).promise();
};