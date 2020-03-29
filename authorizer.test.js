"use strict";

const authorizer = require('./authorizer');


test('Generates token with valid parameters', () => {

    expect(authorizer.generateToken({
        "applicationId": "myImageResizerId",
        "applicationSecret": "myImageResizerSecret"
    })).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoibXlJbWFnZVJlc2l6ZXJJZCIsImFwcGxpY2F0aW9uU2VjcmV0IjoibXlJbWFnZVJlc2l6ZXJTZWNyZXQiLCJpYXQiOjE1ODU0ND[.\-_A-Za-z0-9]{50}$/);
});