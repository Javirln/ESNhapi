'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');

const Boom = require('boom');


let Server;

describe('Countries', function () {

    this.timeout(10000);

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
            .injectThen(FakeCountry.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single country', function () {

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

    it('should throw a duplicate error when creating if it already exists', function () {

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

    it('should be able to delete a country and all the resources underneath', function () {
        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.B)))
            .then(() => Server.inject(FakeCountry.delete(FakeCountry.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakeCountry.get))
            .then((response) => {

                expect(response.result).to.deep.equal([]);
                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakeSection.get))
            .then((response) => {

                expect(response.result).to.deep.equal([]);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should return an error if a country to delete can\'t be found', function () {
        return Server
            .injectThen(FakeCountry.delete(FakeCountry.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });

    it('should be able to fetch the sections of the country', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then(() => Server.injectThen(FakeCity.create(FakeCity.B)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.B)))
            .then(() => Server.inject(FakeCountry.getSections(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal([FakeSection.A, FakeSection.B]);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should return an error if the country can\'t be found while fetching the sections', function () {

        return Server
            .injectThen(FakeCountry.getSections(FakeCountry.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });

    it('should be able to fetch the cities of the country', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeCity.create(FakeCity.B)))
            .then(() => Server.inject(FakeCountry.getCities(FakeCountry.A)))
            .then((response) => {

                expect(response.result).to.deep.equal([FakeCity.A, FakeCity.B]);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should return an error if the country can\'t be found while fetching the cities', function () {

        return Server
            .injectThen(FakeCountry.getCities(FakeCountry.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });



});
