'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');


let Server;

describe('Countries', function () {

    // =====
    // SETUP
    // =====

    before(() => {

        return TestTools.setup()
            .then((server) => Server = server);
    });

    beforeEach(function () {

        return TestTools
            .clearCollection('countries');
    });

    after(function (done) {

        TestTools.teardown(done);
    });

    // =====
    // TESTS
    // =====

    it('should have an existing endpoint', function () {

        return Server
            .inject(FakeCountry.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single country', () => {

        return Server
        // Create country A
            .inject(FakeCountry.create(FakeCountry.A))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeCountry.successPOST);
                expect(response.statusCode).to.equal(201);
            })
            // Get country A
            .then(() => Server.inject(FakeCountry.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(response.result[0]).to.deep.equal(FakeCountry.A);
            });
    });

    it('should be able to fetch a specific country', () => {

        return Server
            .inject(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCountry.getSpecific(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeCountry.A);
                expect(response.statusCode).to.equal(200);
            });
    });

});
