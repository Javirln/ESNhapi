'use strict';

const DateExtend = require('date-extended');
const Promise = require('bluebird');
const Request = require('request-promise');

const base_dir = './app/logs/';
const GoodFile = require('good-file');

const BaseUrlEvents = 'api/v1/events.json';

const toStore = new GoodFile(base_dir.concat('events.log'));

exports.schedule = (server) => {

    server.log('info', 'Getting section data: events');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: events\n');

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

                            server.log('error', `Error updating list of events in section ${section._id}. Error code ${error.statusCode}`)
                        ))
            // Return the valid ones
                .then(() => valid_sections);
        })
        // Update the events of the ones that are online
        .then((valid_sections) => {

            const events = server.mongo.db.collection('events');

            // Request all the events from valid APIs
            return Promise.map(valid_sections, (valid_section) =>

                Request({
                    uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlEvents : '/'.concat(BaseUrlEvents)),
                    json: true,
                    resolveWithFullResponse: true,
                    jar: true
                })
                // Check the date
                    .then((response) =>

                        Promise
                            .each(response.body, (content_events) => {

                                const eventsDate = new Date(content_events.date_starts);

                                // Check if it's newer than 2 months ago
                                if (DateExtend.monthsAgo(2) < eventsDate) {
                                    // Update the DB
                                    return events
                                        .updateOne({

                                            code: valid_section._id + '-events-' + content_events.nid
                                        }, {
                                            title: content_events.title || undefined,
                                            dateStarts: content_events.date_starts || undefined,
                                            dateEnds: content_events.date_ends || undefined,
                                            place: content_events.place || undefined,
                                            price: content_events.price || undefined,
                                            eventType: content_events.event_type || undefined,
                                            meetingPoint: content_events.meeting_point || undefined,
                                            moreInformation: content_events.more_information || undefined,
                                            included: content_events.included || undefined,
                                            content: content_events.content || undefined,
                                            address: content_events.address.length === 0 ? undefined : content_events.address,
                                            location: content_events.location || undefined,
                                            lastUpdate: Date.now()
                                        }, {
                                            upsert: true
                                        })
                                        .then(() => {

                                            toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section._id} || [EVENT-ID] ${content_events.nid} created\n`);
                                        });
                                }
                            })
                    )
                    .catch((error) => server.log('error', `Error updating list of events in section ${valid_section._id}. Error code ${error.statusCode}`))
            );
        })
        .then((result) => server.log('info', 'Events updated'));
};
