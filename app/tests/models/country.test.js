'use strict';

const Test = require('tape');
const TestTools = require('./../test-tools');
let Server;

// Setup server
Test('[Tool] Setup', (t) => {

    TestTools.setup()
        .then((server) => {

            Server = server;
            t.end();
        });
});


Test('[/country] Should be an existing endpoint ', (t) => {

    t.plan(1);

    const getOptions = {
        method: 'GET',
        url: '/countries'
    };

    Server.inject(getOptions, (response) => {

        t.equal(response.statusCode, 200, 'Expect http response status code to be 200 [OK]');
    });

});

// Clear collection 'countries'
TestTools.clearCollection('countries');

Test('[/country] Should be able to create a single country ', (t) => {

    const getOptions = {
        method: 'GET',
        url: '/countries'
    };

    const sampleCountry = {
        _id: 'AA',
        url: 'http://somewhere.com'
    };

    const postOptions = {
        method: 'POST',
        url: '/countries',
        payload: sampleCountry
    };

    const successfulPOSTAnswer = {
        ok: 1,
        n: 1
    };

    const successfulGETAnswer = [{ _id: 'AA', url: 'http://somewhere.com' }];

    t.plan(3);
    Server.inject(postOptions)
        .then((response) => {

            t.equal(response.statusCode, 201, 'Expect http response status code to be 201 [Created]');
            t.deepEqual(response.result, successfulPOSTAnswer, 'Expect result to be a successful answer');
        })
        .then(() => {

            return Server.inject(getOptions)
                .then((response) => {

                    t.deepEqual(response.result, successfulGETAnswer, 'Expect result with one country');
                });
        });
});

// Close the server
TestTools.teardown();
