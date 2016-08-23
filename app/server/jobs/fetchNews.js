'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const News = require('../models/news.mongoose').Model;
const Section = require('../models/section.mongoose').Model;
const Promise = require('bluebird');

const BaseUrlNews = 'api/v1/news.json';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('news.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating Partner List');
    toStore.write(new Date().toString() + ' [INFO] Updating Partner list from Galaxy endpoint\n');

    server.log('info', 'Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: news\n');


    return getValidNews(server)
        .then((validNews) => processValidNews(validNews, server))
        .then((result) => server.log('info', 'Partner updated'));
};

// Find sections that are online and with API
const getValidNews = (server) => {

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
                        uri: section.url.concat(section.url.endsWith('/') ? 'api/v1' : '/api/v1'),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true,
                        timeout: 10000
                    })
                    // Check if the section API is valid
                        .then((response) => {

                            if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                                valid_news.push(section);
                                return Promise.resolve(section);
                            }
                            return Promise.reject(response);
                        })
                        // Log errors
                        .catch((error) =>

                            server.log('error', `Error updating list of news in section ${section.code}. Error code ${error.statusCode}`)
                        );
                })
            // Return the valid ones
                .then(() => valid_news);
        });
};

// Update the news of the ones that are online
const processValidNews = (valid_sections, server) => {

    // Request all the news from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlNews : '/'.concat(BaseUrlNews)),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body, (content_news) => {

                        const newsDate = new Date(content_news.created);

                        // Check if it's newer than 2 months ago
                        if (DateExtend.monthsAgo(2) < newsDate) {
                            const code = valid_section.code + '-news-' + content_news.nid;

                            // Update the DB
                            return News.findOneAndUpdate(
                                { code: code },
                                {
                                    code: code,
                                    title: content_news.title,
                                    createdOnSatellite: content_news.created,
                                    content: content_news.content,
                                    country: valid_section.country,
                                    city: valid_section.city,
                                    section: valid_section.code,
                                    lastUpdate: Date.now()
                                }, {
                                    upsert: true
                                })
                                .then(() => {

                                    toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [NEWS-ID] ${content_news.nid} created\n`);
                                });
                        }
                    })
                )
                .catch((error) => server.log('error', `Error updating list of news in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};

