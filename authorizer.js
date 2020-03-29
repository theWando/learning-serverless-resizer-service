"use strict";

const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY;

const APPLICATION_ID = 'myImageResizerId';
const APPLICATION_SECRET = 'myImageResizerSecret';

module.exports.generateToken = jsonToSign => {
    const [hasValidAppId ,hasValidSecret] = validateAppIdAndSecret(jsonToSign);

    console.log(`[hasValidAppId ${hasValidAppId},hasValidSecret ${hasValidSecret}]`)
    if (hasValidSecret && hasValidAppId) {
        return jwt.sign(jsonToSign, SECRET_KEY);
    } else {
        throw new Error('Invalid token or applicationId');
    }
};

function validateAppIdAndSecret(json) {
    console.log(`json: ${json}`)
    const hasValidAppId = json.applicationId && json.applicationId === APPLICATION_ID;

    const hasValidSecret = json.applicationSecret && json.applicationSecret === APPLICATION_SECRET;

    return [hasValidAppId, hasValidSecret];
}

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const [hasValidAppId ,hasValidSecret] = validateAppIdAndSecret(decoded);

        if (hasValidAppId && hasValidSecret)
            return decoded
        else
            return null;
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