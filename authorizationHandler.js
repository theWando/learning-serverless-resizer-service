"use strict";

const authorizer = require('./authorizer')
const {sendResponse} = require("./utils");

module.exports.generateToken = (event, context, callback) => {
    console.log('generateToken was called');

    const token = authorizer.generateToken(event.body || {});
    console.log(event)
    sendResponse(200, { token }, callback);
};

module.exports.authorize = (event, context, callback) => {
    console.log(event);
    try {
        const policy = authorizer.generatePolicy(event.authorizationToken, event.methodArn);
        callback(null, policy);
    } catch (e) {
        callback(e.message);
    }
};