'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');
const FakePartners = require('../fixtures/samplePartner');

let Server;

describe('Partners', function () {

    this.timeout(10000);

    // =====
    // SETUP
    // =====

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
            .injectThen(FakeSection.getAll, function (response) {

                expect(response.result).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to create a single partner', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create City A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            .then((response) => {

                expect(response.headers.location).to.equal('/partners/' + FakePartners.A.code);
                expect(response.statusCode).to.equal(201);
            })
            // Get New A
            .then(() => Server.inject(FakePartners.getAll))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);

                // Because of the lastUpdate field we cannot compare the entire object as the timestamp changes
                expect(response.result[0].code).to.deep.equal(FakePartners.A.code);
            });
    });

    it('should throw a duplicate error when creating if it already exists', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(409);
            });
    });

    it('should be able to fetch a specific partner', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201);
            })
            .then(() => Server.inject(FakePartners.get(FakePartners.A)))
            .then((response) => {

                expect(response.result.code).to.deep.equal(FakePartners.A.code);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to fetch the partners of a specific section', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create partner A
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            // Get Partners of A
            .then(() => Server.inject(FakeSection.getPartners(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(JSON.parse(response.payload)[0].code).to.deep.equal(FakePartners.A.code);
            });

    });

    it('should return an error if a partner to delete can\'t be found', function () {
        return Server
            .injectThen(FakePartners.delete(FakePartners.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });

    it('should be able to delete an existing partner', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakePartners.create(FakePartners.A)))
            // Get News of A
            .then(() => Server.inject(FakeSection.delete(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(204);
            });
    })

});
