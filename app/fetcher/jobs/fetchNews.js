'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const News = require('../../_common/models/news.mongoose').Model;
const Promise = require('bluebird');
const NormalizeUrl = require('normalize-url');

const BaseUrlNews = 'api/v1/news.json';

const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('news.log'));

exports.schedule = (validSections) => {

    console.log('[INFO] Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: news\n');


    return processValidNews(validSections)
        .then((result) => console.log('[INFO] News updated'));
};

// Update the news of the ones that are online
const processValidNews = (valid_sections) => {

    // Request all the news from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: NormalizeUrl(valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlNews : '/'.concat(BaseUrlNews))),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body,
                        (content_news) => {

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
                                        city: valid_section.code.split('-')[0] + '-' + valid_section.code.split('-')[1],
                                        section: valid_section.code,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    })
                                    .then(() => {

                                        toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [NEWS-ID] ${content_news.nid} created\n`);
                                    });
                            }
                        },
                        { concurrency: 10 }
                    )
                )
                .catch((error) => console.log(`[ERROR] Error updating list of news in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};

