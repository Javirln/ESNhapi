'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const Events = require('../../_common/models/event.mongoose').Model;
const Promise = require('bluebird');
const NormalizeUrl = require('normalize-url');

const BaseUrlEvents = 'api/v1/events.json';

const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('events.log'));

exports.schedule = (validSections) => {

    console.log('[INFO] Getting section data: events');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: events\n');


    return processValidEvents(validSections)
        .then((result) => console.log('[INFO] Events updated'));
};

// Update the events of the ones that are online
const processValidEvents = (valid_sections) => {

    // Request all the events from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: NormalizeUrl(valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlEvents : '/'.concat(BaseUrlEvents))),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body,
                        (content_events) => {

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
                                        address: (content_events.address && content_events.address.length === 0) ? undefined : content_events.address,
                                        location: content_events.location || undefined,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    })
                                    .then(() => {

                                        toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [EVENTS-ID] ${content_events.nid} created\n`);
                                    });
                            }
                        },
                        { concurrency: 10 }
                    )
                )
                .catch((error) => console.log(`[ERROR] Error updating list of events in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};

