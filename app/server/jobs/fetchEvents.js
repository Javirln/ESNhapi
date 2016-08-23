'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const Events = require('../models/event.mongoose').Model;
const Section = require('../models/section.mongoose').Model;
const Promise = require('bluebird');

const BaseUrlEvents = 'api/v1/events.json';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('events.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating Events List');
    toStore.write(new Date().toString() + ' [INFO] Updating Event list from Galaxy endpoint\n');

    server.log('info', 'Getting section data: events');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: events\n');


    return getValidEvents(server)
        .then((validEvents) => processValidEvents(validEvents, server))
        .then((result) => server.log('info', 'Events updated'));
};

// Find sections that are online and with API
const getValidEvents = (server) => {

    return Section
        .find()
        .exec()
        .then((sections) => {

            const valid_events = [];

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
                                valid_events.push(section);
                                return Promise.resolve(section);
                            }
                            return Promise.reject(response);
                        })
                        // Log errors
                        .catch((error) =>

                            server.log('error', `Error updating list of events in section ${section.code}. Error code ${error.statusCode}`)
                        );
                })
            // Return the valid ones
                .then(() => valid_events);
        });
};

// Update the events of the ones that are online
const processValidEvents = (valid_sections, server) => {

    // Request all the events from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlEvents : '/'.concat(BaseUrlEvents)),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body, (content_events) => {

                        const eventsDate = new Date(content_events.date_starts);

                        // Check if it's newer than 2 months ago
                        if (DateExtend.monthsAgo(2) < eventsDate) {
                            const code = valid_section.code + '-events-' + content_events.nid;

                            // Update the DB
                            return Events.findOneAndUpdate(
                                {
                                    code: code
                                }, {
                                    code: code,
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

                                    toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [EVENTS-ID] ${content_events.nid} created\n`);
                                });
                        }
                    })
                )
                .catch((error) => server.log('error', `Error updating list of events in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};

