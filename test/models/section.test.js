'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeSection = require('../fixtures/sampleSection');


let Server;

describe('Sections', function () {

    // =====
    // SETUP
    // =====

    before(() => {

        return TestTools.setup()
            .then((server) => Server = server);
    });

    beforeEach(function () {

        return TestTools
            .clearCollection('sections');
    });

    after(function (done) {

        TestTools.teardown(done);
    });

    // =====
    // TESTS
    // =====

    it('should have an existing endpoint', function () {

        return Server
            .inject(FakeSection.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single section', () => {

        return Server
        // Create country A
            .inject(FakeSection.create(FakeSection.A))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeSection.successPOST);
                expect(response.statusCode).to.equal(201);
            })
            // Get country A
            .then(() => Server.inject(FakeSection.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(response.result[0]).to.deep.equal(FakeSection.A);
            });
    });

    it('should be able to fetch a specific section', () => {

        return Server
            .inject(FakeSection.create(FakeSection.A))
            .then(() => Server.inject(FakeSection.getSpecific(FakeSection.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeSection.A);
                expect(response.statusCode).to.equal(200);
            });
    });

});
