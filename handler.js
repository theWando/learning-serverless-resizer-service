'use strict';

const resizer = require('./resizer')
module.exports.resizer = async event => {
    const s3 = event.Records[0].s3;
    console.log(s3);

    const bucket = s3.bucket.name
    const key = s3.object.key;

    const message = `A file named ${key} was put in a bucket ${bucket}`;
    console.log(message)

    resizer(bucket, key)
        .then(() => {
            console.log("A thumbnail was created");
            callback(null, { message: "A thumbnail was created"})
        })
        .catch(error => {
            console.log(error);
            callback(error);
        })
    return { message: message, event };
};
