'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');


let Server;

// Fixtures

const getOptions = {
    method: 'GET',
    url: '/countries'
};

const sampleCountry = {
    _id: 'AA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere'
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


before((done) => {

    TestTools.setup()
        .then(function (server) {

            Server = server;
            done();
        });
});

beforeEach(function (done) {

    TestTools.clearCollection('countries')
        .then(function () {

            done();
        })
        .catch(function (error) {

            done(new Error(error));
        });
});

after(function (done) {

    TestTools.teardown(done);
});

describe('"Countries"', function () {

    it('should be an existing endpoint', function (done) {

        Server.inject(getOptions, function (response) {

            expect(response.statusCode).to.equal(200);
            done();
        });

    });

    it('should be able to create a single country ', function (done) {

        Server.inject(postOptions)
            .then((response) => {

                expect(response.statusCode).to.equal(201);
                expect(response.result).to.deep.equal(successfulPOSTAnswer);
            })
            .then(() => {

                return Server.inject(getOptions);
            })
            .then((response) => {

                expect(response.result).to.deep.equal([sampleCountry]);
                done();
            })
            .catch((error) => {

                done(new Error(error));
            });
    });

});
