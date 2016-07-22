'use strict';

const DateExtend = require('date-extended');
const Promise = require('bluebird');
const Request = require('request-promise');

const base_dir = './app/logs/';
const GoodFile = require('good-file');

const BaseUrlPartners = 'api/v1/partners.json';

const toStore = new GoodFile(base_dir.concat('partners.log'));

exports.schedule = (server) => {

    server.log('info', 'Getting section data: partners');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: partners\n');

    // Find sections that are online and with API
    return Promise
        .resolve(server.mongo.db.collection('sections').find({}).toArray())
        .then((sections) => {

            const valid_sections = [];

            // Request each section
            return Promise.map(sections,
                (section) =>

                    Request({
                        uri: section.url.concat(section.url.endsWith('/') ? 'api/v1' : '/api/v1'),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true,
                        timeout: 2000
                    })
                    // Check if the section API is valid
                        .then((response) => {

                            if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                                valid_sections.push(section);
                                return Promise.resolve(section);
                            }
                            return Promise.reject(response);
                        })
                        // Log errors
                        .catch((error) =>

                            server.log('error', `Error updating list of partners in section ${section._id}. Error code ${error.statusCode}`)
                        ))
            // Return the valid ones
                .then(() => valid_sections);
        })
        // Update the partners of the ones that are online
        .then((valid_sections) => {

            const partners = server.mongo.db.collection('partners');

            // Request all the partners from valid APIs
            return Promise.map(valid_sections, (valid_section) =>

                Request({
                    uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlPartners : '/'.concat(BaseUrlPartners)),
                    json: true,
                    resolveWithFullResponse: true,
                    jar: true
                })
                // Check the date
                    .then((response) =>

                        Promise
                            .each(response.body, (content_partners) => {

                                // Update the DB (no need to check the date)
                                return partners
                                    .updateOne({

                                        _id: valid_section._id + '-partner-' + content_partners.nid
                                    }, {
                                        name: content_partners.title,
                                        moreInformation: content_partners.more_info.length === 0 ? [] : content_partners.more_info,
                                        content: content_partners.body,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    })
                                    .then(() => {

                                        toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section._id} || [PARTNER-ID] ${content_partners.nid} created\n`);
                                    });
                            })
                    )
                    .catch((error) => server.log('error', `Error updating list of partners in section ${valid_section._id}. Error code ${error.statusCode}`))
            );
        })
        .then((result) => server.log('info', 'Partners updated'));
};
