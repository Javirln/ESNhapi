'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');
const FakeCountry = require('../fixtures/sampleCountry');

const Boom = require('boom');

let Server;

describe('Sections', function () {

    this.timeout(5000);

    // =====
    // SETUP
    // =====

    before(function () {
        this.timeout(0);

        return TestTools.setup()
            .then((server) => Server = server);
    });

    beforeEach(function () {
        this.timeout(0);

        return TestTools.clearCollection('countries')
            .then(() => TestTools.clearCollection('cities'))
            .then(() => TestTools.clearCollection('sections'));
    });

    after(function (done) {

        TestTools.teardown(done);
    });

    // =====
    // TESTS
    // =====

    it('should have an existing endpoint', function () {

        return Server
            .injectThen(FakeSection.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single section', function () {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create City A
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.injectThen(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeSection.successPOST);
                expect(response.statusCode).to.equal(201);
            })
            // Get section A
            .then(() => Server.injectThen(FakeSection.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(response.result[0]).to.deep.equal(FakeSection.A);
            });
    });

    it('should throw a duplicate error when creating if it already exists', function () {
        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.conflict('Duplicated index').output.payload);
                expect(response.statusCode).to.equal(409);
            });
    });

    it('should not allow to create one if a parent country does not exist', function () {

        const parentCountry = FakeCity.A.country;

        return Server
            .injectThen(FakeSection.create(FakeSection.A))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.forbidden(`The parent country ${parentCountry} doesn't exist`).output.payload);
                expect(response.statusCode).to.equal(403);
            });
    });

    it('should not allow to create one if a parent city does not exist', function () {
        const parentCity = FakeCity.A.name;

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.forbidden(`The parent city ${parentCity} doesn't exist`).output.payload);
                expect(response.statusCode).to.equal(403);
            });
    });

    it('should be able to fetch a specific section', () => {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then(() => Server.injectThen(FakeCity.create(FakeCity.B)))
            // Create section A
            .then(() => Server.injectThen(FakeSection.create(FakeSection.A)))
            // Get section A
            .then(() => Server.injectThen(FakeSection.getSpecific(FakeSection.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeSection.A);
                expect(response.statusCode).to.equal(200);
            });
    });

    xit('should be able to delete a section and all the resources underneath', function () {
        throw new Error('To be implemented');
    });

});
