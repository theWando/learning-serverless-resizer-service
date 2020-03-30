"use strict";
const manager = require('./applicationsManager');
const {sendResponse} = require("./utils");

module.exports.create = (event, context, callback) => {
    console.log('create was called');

    manager.create(JSON.parse(event.body || {}))
        .then(() => {
            console.log('credentials saved');
            sendResponse(200, { message: 'credentials saved'}, callback);
        })
        .catch(error => {
            console.log(`error: ${JSON.stringify(error)}`);
            sendResponse(error.statusCode, { message: 'Unexpected error' }, callback);
        });
};