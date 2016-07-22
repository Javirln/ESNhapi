'use strict';

const DateExtend = require('date-extended');
const Promise = require('bluebird');
const Request = require('request-promise');

const base_dir = './app/logs/';
const GoodFile = require('good-file');

const BaseUrlNews = 'api/v1/news.json';

const toStore = new GoodFile(base_dir.concat('news.log'));

exports.schedule = (server) => {

    server.log('info', 'Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: news\n');

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

                            server.log('error', `Error updating list of news in section ${section._id}. Error code ${error.statusCode}`)
                        ))
            // Return the valid ones
                .then(() => valid_sections);
        })
        // Update the news of the ones that are online
        .then((valid_sections) => {

            const news = server.mongo.db.collection('news');

            // Request all the news from valid APIs
            return Promise.map(valid_sections, (valid_section) =>

                Request({
                    uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlNews : '/'.concat(BaseUrlNews)),
                    json: true,
                    resolveWithFullResponse: true,
                    jar: true
                })
                // Check the date
                    .then((response) =>

                        Promise
                            .each(response.body, (content_news) => {

                                const newsDate = new Date(content_news.created);

                                // Check if it's newer than 2 months ago
                                if (DateExtend.monthsAgo(2) < newsDate) {
                                    // Update the DB
                                    return news
                                        .updateOne({

                                            _id: valid_section._id + '-news-' + content_news.nid
                                        }, {
                                            title: content_news.title,
                                            createdOnSatellite: content_news.created,
                                            content: content_news.content,
                                            lastUpdate: Date.now()
                                        }, {
                                            upsert: true
                                        })
                                        .then(() => {

                                            toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section._id} || [NEWS-ID] ${content_news.nid} created\n`);
                                        });
                                }
                            })
                    )
                    .catch((error) => server.log('error', `Error updating list of news in section ${valid_section._id}. Error code ${error.statusCode}`))
            );
        })
        .then((result) => server.log('info', 'News updated'));
};


