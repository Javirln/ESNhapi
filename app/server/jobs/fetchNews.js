'use strict';

const ping = require('net-ping');
const dns = require('dns');
const url = require('url');
const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

const BaseUrlNews = 'api/v1/news.json';

exports.schedule = (server) => {

    server.log('info', 'Getting section data: news');
    server.mongo.db.createCollection('news');
    const sections = server.mongo.db
        .collection('sections').find();

    sections.forEach((section) => {
        return Request({
            uri: section.url + 'api/v1',
            json: true,
            resolveWithFullResponse: true,
            jar: true
        })
            .then(
                (response) => {

                    if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                        const valid_sections = [];
                        valid_sections.push(section);

                        const news = server.mongo.db
                            .collection('news');

                        Promise.all(_.map(valid_sections, (valid_section) => {

                            return Request({
                                uri: valid_section.url + BaseUrlNews,
                                json: true,
                                resolveWithFullResponse: true,
                                jar: true
                            }).then(
                                (response) => {
                                    Promise.all(_.map(response.body, (content_news) => {
                                        return news.updateOne({

                                            _id: section._id + '-news-' + content_news.nid
                                        }, {
                                            title: content_news.title,
                                            createdOnSatellite: content_news.created,
                                            content: content_news.content,
                                            lastUpadted: Date.now()
                                        }, {
                                            upsert: true
                                        });

                                    }))
                                    .then((success) => {
                                        //server.log('info', 'Successfully updated news');
                                    },
                                        (error) => {
                                            server.log('error', 'Error updating list of news:' + error);
                                        });
                                });
                        })).then(() => { server.log('info', 'TODO ACTUALIZADO' )});
                    }
                }
            ).catch((err) => {

            });
    });
};


