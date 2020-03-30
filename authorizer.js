"use strict";

const jwt = require('jsonwebtoken')

const applicationsManager = require('./applicationsManager')

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.generateToken = jsonToSign => {
    return validateAppIdAndSecret(jsonToSign)
        .then(certs => {
            if (!!certs && certs.applicationSecret === jsonToSign.applicationSecret) {
                return jwt.sign(jsonToSign, SECRET_KEY);
            } else {
                throw new Error('Invalid token or applicationId');
            }
        })
        .catch(error => {
            throw new Error('Invalid token or applicationId');
        });
};

function validateAppIdAndSecret(json) {
    console.log(`json: ${JSON.stringify(json)}`);

    return applicationsManager.getCredentials(json.applicationId, json.applicationSecret);
}

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        return validateAppIdAndSecret(decoded);
    } catch (e) {
        return null;
    }
}

function buildPolicy(principalId, effect, resource) {
    let authResponse = {};
    authResponse.principalId = principalId;

    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        };
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}

module.exports.generatePolicy = (token, methodArn) => {
    if (decodeToken(token) != null) {
        return buildPolicy('user', 'Allow', methodArn);
    } else {
        throw new Error('Unauthorized');
    }
};