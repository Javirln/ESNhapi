'use strict';

const Section = require('../../_common/models/section.mongoose').Model;
const Promise = require('bluebird');
const Request = require('request-promise');
const NormalizeUrl = require('normalize-url');

// Find sections that are online and with API
module.exports = () => {

    return Section
        .find()
        .exec()
        .then((sections) => {

            const valid_news = [];

            // Request each section
            return Promise.map(sections,
                (sectionItem) => {

                    const section = sectionItem.toObject();

                    return Request({
                        uri: NormalizeUrl(section.url.concat(section.url.endsWith('/') ? 'api/v1' : '/api/v1')),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true,
                        timeout: 10000
                    })
                    // Log errors
                        .catch((error) => Promise.reject(console.log(`[ERROR] Error connecting to section ${section.code} | ${error.cause.code}`)))
                        // Check if the section API is valid
                        .then((response) => {

                            if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                                valid_news.push(section);
                                return Promise.resolve(section);
                            }
                            return Promise.reject(console.log(`[ERROR] Error connecting to API in section ${section.code} | EBADAPICONF`));
                        })
                        .catch(() => Promise.resolve());
                },
                { concurrency: 10 })
            // Return the valid ones
                .then(() => valid_news);
        });
};
