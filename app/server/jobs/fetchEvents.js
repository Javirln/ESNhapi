'use strict';

const ping = require('net-ping');
const dns = require('dns');
const url = require('url');
const Request = require('request-promise');
const _ = require('lodash');

const BaseUrlEvents = 'api/v1/events.json';

exports.schedule = (server) => {

    server.log('info', 'Getting section data: events');

    server.mongo.db.createCollection('events');

    const sections = server.mongo.db
        .collection('sections').find({ alive: true });

    Promise.all(
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

                            const events = server.mongo.db
                                .collection('events');

                            Promise.all(_.map(valid_sections, (valid_section) => {

                                return Request({
                                    uri: valid_section.url + BaseUrlEvents,
                                    json: true,
                                    resolveWithFullResponse: true,
                                    jar: true
                                }).then(
                                    (response) => {
                                        Promise.all(_.map(response.body, (content_events) => {

                                            const dateNow = new Date();
                                            const eventDate = new Date(content_events.date_starts);

                                                //Controlling first January and December, since the reduction of their indexes is negative
                                            if (dateNow.getYear() - eventDate.getYear() === 1 && dateNow.getMonth() - eventDate.getMonth() === -11) {
                                                return events.updateOne({

                                                    _id: valid_section._id + '-events-' + content_events.nid
                                                }, {
                                                    title: content_events.title,
                                                    dateStarts: content_events.date_starts,
                                                    date_ends: content_events.date_ends,
                                                    place: content_events.place,
                                                    price: content_events.price,
                                                    eventType: content_events.event_type,
                                                    meetingPoint: content_events.meeting_point,
                                                    moreInformation: content_events.more_information,
                                                    included: content_events.included,
                                                    content: content_events.content,
                                                    address: content_events.address,
                                                    location: content_events.location,
                                                    lastUpdate: Date.now()
                                                }, {
                                                    upsert: true
                                                });
                                                // Controlling the rest of the months
                                            } else if  (dateNow.getYear() === eventDate.getYear() && dateNow.getMonth() - eventDate.getMonth() === (0 || 1)) {
                                                return events.updateOne({

                                                    _id: valid_section._id + '-events-' + content_events.nid
                                                }, {
                                                    title: content_events.title,
                                                    dateStarts: content_events.date_starts,
                                                    date_ends: content_events.date_ends,
                                                    place: content_events.place,
                                                    price: content_events.price,
                                                    eventType: content_events.event_type,
                                                    meetingPoint: content_events.meeting_point,
                                                    moreInformation: content_events.more_information,
                                                    included: content_events.included,
                                                    content: content_events.content,
                                                    address: content_events.address,
                                                    location: content_events.location,
                                                    lastUpdate: Date.now()
                                                }, {
                                                    upsert: true
                                                });
                                            }
                                        }))
                                            .then((success) => {

                                            },
                                                (error) => {
                                                    server.log('error', 'Error updating list of events:' + error);
                                                });
                                    });
                            })).then(() => {

                            });
                        }
                    }
                ).then(() => {
                    server.log('info', 'Guardadas las noticias');
                })
                .catch((err) => {

                });
        })
    ).then(() => {
        server.log('info', 'Events loaded');
    });
};


