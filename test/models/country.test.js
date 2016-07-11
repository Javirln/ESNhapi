'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');

const Boom = require('boom');


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
            .injectThen(FakeCountry.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single country', () => {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeCountry.successPOST);
                expect(response.statusCode).to.equal(201);
            })
            // Get country A
            .then(() => Server.injectThen(FakeCountry.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(response.result[0]).to.deep.equal(FakeCountry.A);
            });
    });

    it('should throw a duplicate error when creating if it already exists', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCountry.create(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.conflict('Duplicated index').output.payload);
                expect(response.statusCode).to.equal(409);
            });
    });

    it('should be able to fetch a specific country', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCountry.getSpecific(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeCountry.A);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to delete a country and all the resources underneath', () => {
        throw new Error("To be implemented");
    });

    it('should be able to fetch the sections of the country', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.B)))
            .then(() => Server.inject(FakeCountry.getSections(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal([FakeSection.A, FakeSection.B]);
                expect(response.statusCode).to.equal(200);
            });
    });

});
