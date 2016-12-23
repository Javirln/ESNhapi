'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeCity = require('../fixtures/sampleCity');
const FakeSection = require('../fixtures/sampleSection');


let Server;
let cont = 0;

describe('Cities', function () {

    this.timeout(10000);

    // =====
    // SETUP
    // =====

    // Retry all tests in this suite up to 3 times
    this.retries(3);

    before(function () {
        this.timeout(0);

        return TestTools.setup()
            .then((server) => Server = server);
    });

    beforeEach(function (done) {
        this.timeout(0);
        TestTools.clearDatabase(done);
    });

    after(function () {

        return TestTools.teardown()
    });

    // =====
    // TESTS
    // =====

    it('should have an existing endpoint', function () {

        return Server
            .injectThen(FakeCity.getAll, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single city', function () {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
        // Create city A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.headers.location).to.equal('/cities/' + FakeCity.A.code);
                expect(response.statusCode).to.equal(201);
            })
            // Get city A
            .then(() => Server.inject(FakeCity.getAll))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(JSON.parse(response.payload)[0]).to.deep.equal(FakeCity.A);
            });

    });

    it('should throw a duplicate error when creating if it already exists', function () {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(409);
            });
    });

    it('should throw a bad request error if the parent country doesn\'t exist', function () {

        const parentCountry = FakeCity.A.country;

        return Server
            .injectThen(FakeCity.create(FakeCity.A))
            .then((response) => {

                expect(response.statusCode).to.equal(400);
            });
    });

    it('should be able to fetch a specific city', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeCity.get(FakeCity.A)))
            .then((response) => {

                expect(JSON.parse(response.payload)).to.deep.equal(FakeCity.A);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to delete a city and all the resources underneath', function () {
        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.B)))
            .then(() => Server.inject(FakeCity.delete(FakeCity.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(204);
            })
            .then(() => Server.inject(FakeCity.getAll))
            .then((response) => {

                expect(response.result).to.deep.equal([]);
                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakeSection.getAll))
            .then((response) => {

                expect(response.result).to.deep.equal([]);
                expect(response.statusCode).to.equal(200);
            });
    });

});
