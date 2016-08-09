'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');
const FakeNews = require('../fixtures/sampleNews');

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
        return TestTools.clearDatabase();
    });

    after(function () {

        return TestTools.teardown()
    });

    // =====
    // TESTS
    // =====

    it('should have an existing endpoint', function () {

        Server.injectThen(FakeCountry.get)
            .then((response) => {

                expect(JSON.parse(response.payload)).to.be.a('array');
                expect(response.statusCode).to.equal(200);
            })
            .catch((error) => console.log(error));

    });

    it('should be able to create a single country', function () {

        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then((response) => {

                expect(response.headers.location).to.equal('/countries/' + FakeCountry.A.code);
                expect(response.statusCode).to.equal(201);
            })
            // Get country A
            .then(() => Server.injectThen(FakeCountry.get))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(JSON.parse(response.payload)[0]).to.deep.equal(FakeCountry.A);
            });
    });

    it('should throw a duplicate error when creating if it already exists', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCountry.create(FakeCountry.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(409);
            });
    });

    it('should be able to fetch a specific country', () => {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCountry.getOne(FakeCountry.A)))
            .then((response) => {

                expect(JSON.parse(response.payload)).to.deep.equal(FakeCountry.A);
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

                expect(response.statusCode).to.equal(204);
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
            .then((response) => Server.injectThen(FakeCity.create(FakeCity.A)))
            .then((response) => Server.injectThen(FakeCity.create(FakeCity.B)))
            .then((response) => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => Server.inject(FakeSection.create(FakeSection.B)))
            .then((response) => Server.inject(FakeCountry.getSections(FakeCountry.A)))
            .then((response) => {

                expect(JSON.parse(response.payload)).to.deep.equal([FakeSection.A, FakeSection.B]);
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

                expect(JSON.parse(response.payload)).to.deep.equal([FakeCity.A, FakeCity.B]);
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

    it('should be able to fetch the news of the country', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then(() => Server.inject(FakeCountry.getNews(FakeCountry.A)))
            .then((response) => {

                expect(response.result[0].title).to.equal(FakeNews.A.title);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should return an error if the country can\'t be found while fetching the news', function () {

        return Server
            .injectThen(FakeCountry.getNews(FakeCountry.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });


});
