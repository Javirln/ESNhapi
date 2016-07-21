'use strict';

const Request = require('request-promise');
const _ = require('lodash');

const base_dir = './app/logs/';
const GoodFile = require('good-file');

const BaseUrlPartners = 'api/v1/partners.json';

const toStore = new GoodFile(base_dir.concat('partners.log'));

exports.schedule = (server) => {

    server.log('info', 'Getting section data: partners');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: partners\n');

    server.mongo.db.createCollection('partners');

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
                    const partners = server.mongo.db
                        .collection('partners');
                    return [valid_sections, partners];
                }
            ).then((result) => {
                Promise.all(_.map(result[0], (valid_section) => {

                    return Request({
                        uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlPartners : '/'.concat(BaseUrlPartners)),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true
                    }).then(
                        (response) => {
                            Promise.all(_.map(response.body, (partners) => {
                                return result[1].updateOne({
                                    _id: valid_section._id + '-partners-' + partners.nid
                                }, {
                                    name: partners.title,
                                    moreInformation: partners.more_info.length === 0 ? [] : partners.more_info,
                                    content: partners.body,
                                    lastUpdate: Date.now()
                                }, {
                                    upsert: true
                                }).then(toStore.write(new Date().toString() + ' [INFO] ' + ' [SECTION-CODE] ' + valid_section._id + ' || ' + ' [PARTNER-ID] ' + partners.nid + ' created\n'));

                            }))
                                .then(() => {
                                    server.log('info', 'Successfully updated partners');
                                    console.log('info', 'Successfully updated partners');
                                },
                                (error) => {
                                    server.log('error', 'Error updating list of partners:' + error);
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
        server.log('info', 'Partners updated');
    });
};


