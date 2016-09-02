'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');
const FakeNews = require('../fixtures/sampleNews');

let Server;

describe('News', function () {

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
        return TestTools.clearDatabase();
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

    it('should be able to create a single new', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create City A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then((response) => {

                expect(response.headers.location).to.equal('/news/' + FakeNews.A.code);
                expect(response.statusCode).to.equal(201);
            })
            // Get New A
            .then(() => Server.inject(FakeNews.getAll))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);

                // Because of the lastUpdate field we cannot compare the entire object as the timestamp changes
                expect(response.result[0].code).to.deep.equal(FakeNews.A.code);
            });
    });

    it('should throw a duplicate error when creating if it already exists', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(409);
            });
    });

    it('should be able to fetch a specific new', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201);
            })
            .then(() => Server.inject(FakeNews.get(FakeNews.A)))
            .then((response) => {

                expect(response.result.code).to.deep.equal(FakeNews.A.code);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to fetch the news of a specific section', () => {
        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create city A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            // Get News of A
            .then(() => Server.inject(FakeSection.getNews(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(JSON.parse(response.payload)[0].code).to.deep.equal(FakeNews.A.code);
            });

    });

    it('should return an error if a new to delete can\'t be found', function () {
        return Server
            .injectThen(FakeNews.delete(FakeNews.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });

    it('should be able to delete an existing new', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            // Get News of A
            .then(() => Server.inject(FakeSection.delete(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(204);
            });
    })

});
