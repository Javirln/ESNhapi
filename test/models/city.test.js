'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeCity = require('../fixtures/sampleCity');

const Boom = require('boom');

let Server;

describe('Cities', function () {

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
            .injectThen(FakeCity.get, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single city', function () {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
        // Create city A
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.result).to.deep.equal('City successfully created');
                expect(response.statusCode).to.equal(201);
            })
            // Get city A
            .then(() => Server.injectThen(FakeCity.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(response.result[0]).to.deep.equal(FakeCity.A);
            });

    });

    it('should throw a duplicate error when creating if it already exists', function () {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.conflict('Duplicated index').output.payload);
                expect(response.statusCode).to.equal(409);
            });
    });

    it('should throw a bad request error if the parent country doesn\'t exist', function () {

        const parentCountry = FakeCity.A.country;

        return Server
            .injectThen(FakeCity.create(FakeCity.A))
            .then((response) => {

                expect(response.result).to.deep.equal(Boom.forbidden(`The parent country ${parentCountry} doesn't exist`).output.payload);
                expect(response.statusCode).to.equal(403);
            });
    });

    it('should be able to fetch a specific city', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeCity.getSpecific(FakeCity.A)))
            .then((response) => {

                expect(response.result).to.deep.equal(FakeCity.A);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to delete a city ', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.result).to.deep.equal('City successfully created');
                expect(response.statusCode).to.equal(201);
            })
            // Get city A
            .then(() => Server.injectThen(FakeCity.get))
            .then((cities) => {

                expect(cities.result).to.be.a('array');
                expect(cities.result.length).to.equal(1);
                expect(cities.result[0]).to.deep.equal(FakeCity.A);
            })
            // Delete city A
            .then(() => Server.injectThen(FakeCity.delete(FakeCity.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.injectThen(FakeCity.get))
            .then((response) => {
                expect(response.result).to.deep.equal([]);
                expect(response.statusCode).to.equal(200);
            });
    });

});
