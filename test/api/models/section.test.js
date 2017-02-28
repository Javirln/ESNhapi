'use strict';

const expect = require('chai').expect;   // assertion library
const TestTools = require('./../test-tools');
const FakeCountry = require('../fixtures/sampleCountry');
const FakeSection = require('../fixtures/sampleSection');
const FakeCity = require('../fixtures/sampleCity');
const FakeNews = require('../fixtures/sampleNews');
const FakePartner = require('../fixtures/samplePartner');
const FakeEvent = require('../fixtures/sampleEvent');

let Server;

describe('Sections', function () {

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

    it('should be able to create a single section', function () {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            // Create City A
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.headers.location).to.equal('/sections/' + FakeSection.A.code);
                expect(response.statusCode).to.equal(201);
            })
            // Get section A
            .then(() => Server.inject(FakeSection.getAll))
            .then((response) => {

                expect(response.result).to.be.a('array');
                expect(response.result.length).to.equal(1);
                expect(JSON.parse(response.payload)[0]).to.deep.equal(FakeSection.A);
            });
    });

    it('should throw a duplicate error when creating if it already exists', function () {

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(409);
            });
    });

    it('should not allow to create one if a parent country does not exist', function () {

        const parentCountry = FakeCity.A.country;

        return Server
            .injectThen(FakeSection.create(FakeSection.A))
            .then((response) => {

                expect(response.statusCode).to.equal(400);
            });
    });

    it('should not allow to create one if a parent city does not exist', function () {
        const parentCity = FakeCity.A.name;

        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(400);
            });
    });

    it('should return an error if a section to delete can\'t be found', function () {
        return Server
            .injectThen(FakeSection.delete(FakeSection.A))
            .then((response) => {

                expect(response.statusCode).to.equal(404);
            });
    });

    it('should be able to fetch a specific section', () => {

        return Server
            // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Get section A
            .then(() => Server.inject(FakeSection.get(FakeSection.A)))
            .then((response) => {

                expect(JSON.parse(response.payload)).to.deep.equal(FakeSection.A);
                expect(response.statusCode).to.equal(200);
            });
    });

    it('should be able to fetch the news of a specific section', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create new A
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            // Get News of A
            .then(() => Server.inject(FakeSection.getNews(FakeSection.A)))
            .then((response) => {

                expect(response.result[0].title).to.equal(FakeNews.A.title);
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to fetch the partners of a specific section', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create partner A
            .then(() => Server.inject(FakePartner.create(FakePartner.A)))
            // Get Partners of A
            .then(() => Server.inject(FakeSection.getPartners(FakeSection.A)))
            .then((response) => {

                expect(response.result[0].code).to.equal(FakePartner.A.code);
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to fetch the events of a specific section', () => {
        return Server
        // Create country A
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            // Create section A
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            // Create event A
            .then(() => Server.inject(FakeEvent.create(FakeEvent.A)))
            // Get Events of A
            .then(() => Server.inject(FakeSection.getEvents(FakeSection.A)))
            .then((response) => {

                expect(response.result[0].code).to.equal(FakeEvent.A.code);
                expect(response.statusCode).to.equal(200);
            });

    });

    it('should be able to delete a section and all the resources underneath', function () {
        return Server
            .injectThen(FakeCountry.create(FakeCountry.A))
            .then(() => Server.inject(FakeCity.create(FakeCity.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201)
            })
            .then(() => Server.inject(FakeSection.create(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201)
            })
            .then(() => Server.inject(FakeNews.create(FakeNews.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201)
            })
            .then(() => Server.inject(FakePartner.create(FakePartner.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201)
            })
            .then(() => Server.inject(FakeEvent.create(FakeEvent.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(201)
            })
            .then(() => Server.inject(FakeSection.delete(FakeSection.A)))
            .then((response) => {

                expect(response.statusCode).to.equal(204);
            })
            .then(() => Server.inject(FakeSection.getAll))
            .then((response) => {

                expect(response.result.length).to.equal(0);
                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakeNews.getAll))
            .then((response) => {

                expect(response.result.length).to.equal(0);
                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakePartner.getAll))
            .then((response) => {

                expect(response.result.length).to.equal(0);
                expect(response.statusCode).to.equal(200);
            })
            .then(() => Server.inject(FakeEvent.getAll))
            .then((response) => {

                expect(response.result.length).to.equal(0);
                expect(response.statusCode).to.equal(200);
            });
    });

});
