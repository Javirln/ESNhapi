'use strict';

const Request = require('request-promise');
const _ = require('lodash');

const BaseUrlEvents = 'api/v1/events.json';

exports.schedule = (server) => {

    server.log('info', 'Getting section data: events');

    server.mongo.db.createCollection('events');

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
                    const events = server.mongo.db
                        .collection('events');
                    return [valid_sections, events];
                }
            ).then((result) => {
                Promise.all(_.map(result[0], (valid_section) => {

                    return Request({
                        uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlEvents : '/'.concat(BaseUrlEvents)),
                        json: true,
                        resolveWithFullResponse: true,
                        jar: true
                    }).then(
                        (response) => {

                            Promise.all(_.map(response.body, (content_events) => {

                                const dateNow = new Date();
                                const eventsDate = new Date(content_events.date_starts);

                                //Checking first January and December, since the reduction of their indexes is negative
                                if (dateNow.getUTCFullYear() - eventsDate.getUTCFullYear() === 1 && dateNow.getUTCMonth() - eventsDate.getUTCMonth() === -11) {
                                    return result[1].updateOne({
                                        _id: valid_section._id + '-events-' + content_events.nid
                                    }, {
                                        title: content_events.title,
                                        dateStarts: content_events.date_starts,
                                        dateEnds: content_events.date_ends,
                                        place: content_events.place,
                                        price: content_events.price,
                                        eventType: content_events.event_type,
                                        meetingPoint: content_events.meeting_point,
                                        moreInformation: content_events.more_information,
                                        included: content_events.included,
                                        content: content_events.content,
                                        address: content_events.address.length === 0 ? { } : content_events.address,
                                        location: content_events.location,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    });
                                    // Checking the rest of the months
                                } else if (dateNow.getUTCFullYear() === eventsDate.getUTCFullYear() &&
                                    (dateNow.getUTCMonth() - eventsDate.getUTCMonth() === 0 || eventsDate.getUTCMonth() - eventsDate.getUTCMonth() === 1)){
                                    return result[1].updateOne({
                                        _id: valid_section._id + '-events-' + content_events.nid
                                    }, {
                                        title: content_events.title,
                                        dateStarts: content_events.date_starts,
                                        dateEnds: content_events.date_ends,
                                        place: content_events.place,
                                        price: content_events.price,
                                        eventType: content_events.event_type,
                                        meetingPoint: content_events.meeting_point,
                                        moreInformation: content_events.more_information,
                                        included: content_events.included,
                                        content: content_events.content,
                                        address: content_events.address.length === 0 ? { } : content_events.address,
                                        location: content_events.location,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    });
                                }
                            }))
                                .then(() => {
                                    server.log('info', 'Successfully updated events');
                                },
                                (error) => {
                                    server.log('error', 'Error updating list of evets:' + error);
                                });
                        }).catch((err) => {
                        //URL de Noticias no valida
                        });
                })).then(() => {  });
            }).catch((err) => {
                    //URL de API no valida
            });
        },
            () => {

            })
    ).then( () => {
        server.log('info', 'News updated');
    });
};


