'use strict';

const AWS = require('aws-sdk');
const stepFunctions = new AWS.StepFunctions();

const resizer = require('./resizer');

module.exports.resizer = (event, context, callback) => {
    console.log(event);

    const bucket = event.bucketName;
    const key = event.objectKey;

    const message = `A file named ${key} was put in a bucket ${bucket}`;
    console.log(message)

    resizer(bucket, key)
        .then(() => {
            console.log(`A thumbnail was created`);
            callback(null, { message: `A thumbnail was created`})
        })
        .catch(error => {
            console.log(error);
            callback(error);
        });
};


module.exports.saveImageMetadata = (event, context, callback) => {
    console.log(event);

    const bucket = event.bucketName;
    const key = event.objectKey;

    console.log('saveImageMetadata was called');
    //TODO
}
module.exports.thumbnailLogger = (event, context, callback) => {
    const s3 = event.Records[0].s3;
    const bucket = s3.bucket.name
    const key = s3.object.key;

    const message = `A file named ${key} was put in a bucket ${bucket}`;
    console.log(message)

    return {message: 'Go Serverless v1.0! Your function executed successfully!', event};
};

module.exports.executeStepFunction = (event, context, callback) => {
    const stateMachineName = 'ImageProcessingMachine';

    console.log('Fetching the list of available workflows');

    stepFunctions
        .listStateMachines({})
        .promise()
        .then(listStateMachines => {
            console.log('Searching for the step function', listStateMachines);
            for (let i = 0; i < listStateMachines.stateMachines.length; i++) {
                const item = listStateMachines.stateMachines[i];
                if (item.name.indexOf(stateMachineName) >= 0) {
                    console.log('Found the step function');

                    const eventData = event.Records[0];

                    const params = {
                        stateMachineArn: item.stateMachineArn,
                        input: JSON.stringify({
                            objectKey: eventData.s3.object.key,
                            bucketName: eventData.s3.bucket.name
                        })
                    };

                    console.log('Start execution');
                    stepFunctions.startExecution(params).promise().then(() => {
                        return context.succeed('OK');
                    });
                }
            }
        })
        .catch(error => {
            return context.fail(error);
        });
}