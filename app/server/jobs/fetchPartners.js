'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const Partner = require('../models/partner.mongoose').Model;
const Section = require('../models/section.mongoose').Model;
const Promise = require('bluebird');

const BaseUrlPartners = 'api/v1/partners.json';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('partners.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating Partner List');
    toStore.write(new Date().toString() + ' [INFO] Updating Partner list from Galaxy endpoint\n');

    server.log('info', 'Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: partner\n');


    return getValidPartners(server)
        .then((validPartners) => processValidPartners(validPartners, server))
        .then((result) => server.log('info', 'Partner updated'));
};

// Find sections that are online and with API
const getValidPartners = (server) => {

    return Section
        .find()
        .exec()
        .then((sections) => {

            const validPartners = [];

            // Request each section
            return Promise.map(sections,
                (sectionItem) => {

                    const section = sectionItem.toObject();

                    return Request({
                        uri: section.url.concat(section.url.endsWith('/') ? 'api/v1' : '/api/v1'),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true,
                        timeout: 10000
                    })
                    // Check if the section API is valid
                        .then((response) => {

                            if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                                validPartners.push(section);
                                return Promise.resolve(section);
                            }
                            return Promise.reject(response);
                        })
                        // Log errors
                        .catch((error) =>

                            server.log('error', `Error updating list of partners in section ${section.code}. Error code ${error.statusCode}`)
                        );
                })
            // Return the valid ones
                .then(() => validPartners);
        });
};

// Update the partners of the ones that are online
const processValidPartners = (valid_sections, server) => {

    // Request all the partners from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlPartners : '/'.concat(BaseUrlPartners)),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body, (content_partner) => {

                        const partnerDate = new Date(content_partner.created);

                        // Check if it's newer than 2 months ago
                        if (DateExtend.monthsAgo(2) < partnerDate) {
                            const code = valid_section.code + '-partners-' + content_partner.nid;

                            // Update the DB
                            return Partner.findOneAndUpdate(
                                { code: code },
                                {
                                    code:code,
                                    name: content_partner.title,
                                    moreInformation: content_partner.more_info.length === 0 ? [] : content_partner.more_info,
                                    content: content_partner.body,
                                    lastUpdate: Date.now()
                                }, {
                                    upsert: true
                                })
                                .then(() => {

                                    toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [PARTNER-ID] ${content_partner.nid} created\n`);
                                });
                        }
                    })
                )
                .catch((error) => server.log('error', `Error updating list of partners in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};