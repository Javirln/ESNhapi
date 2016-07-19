'use strict';

const Request = require('request-promise');
const _ = require('lodash');

const base_dir = './app/logs/';
const GoodFile = require('good-file');

const BaseUrlNews = 'api/v1/news.json';

const toStore = new GoodFile(base_dir.concat('news.log'));

exports.schedule = (server) => {

    server.log('info', 'Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: news\n');

    server.mongo.db.createCollection('news');

    const sections = server.mongo.db
        .collection('sections').find({});
    Promise.
        all(
        sections.forEach((section) => {
            return Request({
                uri: section.url.concat(section.url.endsWith('/') ? 'api/v1' : '/api/v1'),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            }).then(
                    (response) => {
                        const valid_sections = [];

                        if (response.statusCode === 200 && response.body.indexOf('Services Endpoint "esnapi_v1" has been setup successfully.') > -1) {
                            valid_sections.push(section);
                        }
                        const news = server.mongo.db
                            .collection('news');
                        return [valid_sections, news];
                    }
                ).then((result) => {
                    Promise.all(_.map(result[0], (valid_section) => {

                        return Request({
                            uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlNews : '/'.concat(BaseUrlNews)),
                            json: true,
                            resolveWithFullResponse: true,
                            jar: true
                        }).then(
                            (response) => {
                                Promise.all(_.map(response.body, (content_news) => {

                                    const dateNow = new Date();
                                    const newsDate = new Date(content_news.created);

                                    //Checking first January and December, since the reduction of their indexes is negative
                                    if (dateNow.getUTCFullYear() - newsDate.getUTCFullYear() === 1 && dateNow.getUTCMonth() - newsDate.getUTCMonth() === -11) {
                                        return result[1].updateOne({

                                            _id: valid_section._id + '-news-' + content_news.nid
                                        }, {
                                            title: content_news.title,
                                            createdOnSatellite: content_news.created,
                                            content: content_news.content,
                                            lastUpdate: Date.now()
                                        }, {
                                            upsert: true
                                        }).then(toStore.write(new Date().toString() + ' [INFO] ' + ' [SECTION-CODE] ' + valid_section._id + ' || ' + ' [NEW-ID] ' + content_news.nid + ' created\n'));
                                        // Checking the rest of the months
                                    } else if (dateNow.getUTCFullYear() === newsDate.getUTCFullYear() &&
                                        (dateNow.getUTCMonth() - newsDate.getUTCMonth() === 0 || dateNow.getUTCMonth() - newsDate.getUTCMonth() === 1)){
                                        return result[1].updateOne({

                                            _id: valid_section._id + '-news-' + content_news.nid
                                        }, {
                                            title: content_news.title,
                                            createdOnSatellite: content_news.created,
                                            content: content_news.content,
                                            lastUpdate: Date.now()
                                        }, {
                                            upsert: true
                                        }).then(toStore.write(new Date().toString() + ' [INFO] ' + ' [SECTION-CODE] ' + valid_section._id + ' || ' + ' [NEW-ID] ' + content_news.nid + ' created\n'));
                                    }
                                }))
                                .then(() => {
                                    server.log('info', 'Successfully updated news');
                                    console.log('info', 'Successfully updated news');
                                },
                                (error) => {
                                    server.log('error', 'Error updating list of news:' + error);
                                });
                            }).catch((err) => {
                            //URL de Noticias no valida
                            });
                    })).then(() => {  });
                }).catch((err, valid_section) => {
                    //URL de API no valida
                });
        },
        () => {

        })
    ).then( () => {
        server.log('info', 'News updated');
    });
};


