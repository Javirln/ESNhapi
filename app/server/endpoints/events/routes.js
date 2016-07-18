'use strict';

const Joi = require('joi');
const Boom = require('boom');
const EventsModel = require('./model');

module.exports = [
    {
        path: '/events',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            reply(db
                .collection('events')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            description: 'Gets all events',
            response: { schema: Joi.array().items(EventsModel).label('Events') },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('events')
                .insertOne({
                    title: req.payload.title,
                    dateStarts: req.payload.dateStarts,
                    dateEnds: req.payload.dateEnds,
                    place: req.payload.place,
                    price: req.payload.price,
                    eventType: req.payload.eventType,
                    meetingPoint: req.payload.meetingPoint,
                    moreInformation: req.payload.moreInformation,
                    included: req.payload.included,
                    content: req.payload.content,
                    address: req.payload.address,
                    location: req.payload.location,
                    lastUpdate: Date.now()
                })
                .then(
                    (result) => {
                        console.log(result);
                        reply('Event successfully created').code(201);
                    },
                    (err) => {

                        if (err) {
                            if (err.code === 11000) {
                                return reply(Boom.conflict('Duplicated index', err.errmsg));
                            }
                            return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                        }
                    });
        },
        config: {
            description: 'Creates an event',
            validate: {
                payload: {
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-events-[0-9]+$/).required().example('AA-AAAA-AAA-events-1234')
                        .description('Code of the event'),

                    title: Joi.string().required().example('Awesome title')
                        .description('Title of the event'),

                    dateStarts: Joi.date().required().example('2016-06-05T12:32:35+02:00')
                        .description('The date when the event starts'),

                    dateEnds: Joi.date().example('2016-06-10T12:00:00+02:00')
                        .description('The date when the event ends'),

                    place: Joi.any().example('Antartica')
                        .description('Where the event is taking place'),

                    price: Joi.any().example('19,95€')
                        .description('Price of the Event'),


                    eventType: Joi.array().items(Joi.string().example('Cultural'))
                        .description('Event type'),

                    meetingPoint: Joi.any().example('Midtown')
                        .description('Where is the meeting point'),

                    moreInformation: Joi.array().items(Joi.string().example('Bar\'s website'))
                        .description('Links to more information'),

                    included: Joi.array().items(Joi.string().example('Transport'))
                        .description('What\'s included in the price'),

                    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                        .description('The description of the event'),
                    // Since although filling all fields on an Event on Satellite, we still don't know the types, so Joi.any() will do the trick for the moment
                    address: Joi.any({
                        country: Joi.any(),
                        administrative_area: Joi.any(),
                        sub_administrative_area: Joi.any(),
                        locality: Joi.any(),
                        dependent_locality: Joi.any(),
                        postal_code: Joi.any(),
                        thoroughfare: Joi.any(),
                        premise: Joi.any(),
                        sub_premise: Joi.any(),
                        organisation_name: Joi.any(),
                        name_line: Joi.any(),
                        first_name: Joi.any(),
                        last_name: Joi.any(),
                        data: Joi.any()
                    })
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The new with the given code does not exist' },
                        '409': { 'description': 'There is already a new with that index' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events/{_id}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('events')
                .deleteOne({ _id: req.params._id })
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The event with code ' + req.params._id + ' does not exist').code(404); // If no items deleted, return a 404
                        }
                        reply('Event successfully removed').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Deletes an event',
            validate: {
                params: {
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-events-[0-9]+$/).required().example('AA-AAAA-AAA-events-1234')
                        .description('Code of the events')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-events-1234' },
                        '404': { 'description': 'The event with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'PUT',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('events')
                .replaceOne(
                    { _id: req.payload._id },
                {
                    title: req.payload.title,
                    dateStarts: req.payload.dateStarts,
                    dateEnds: req.payload.dateEnds,
                    place: req.payload.place,
                    price: req.payload.price,
                    eventType: req.payload.eventType,
                    meetingPoint: req.payload.meetingPoint,
                    moreInformation: req.payload.moreInformation,
                    included: req.payload.included,
                    content: req.payload.content,
                    address: req.payload.address,
                    location: req.payload.location,
                    lastUpdate: Date.now()
                }
                )
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The event with code ' + req.payload._id + ' does not exist').code(404);
                        }
                        reply('New successfully updated').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Updates the content of an event',
            validate: {
                payload: EventsModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must contains all the fields' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a event');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events/{_id}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('events')
                .findOne({ _id: req.params._id })
                .then(
                    (result) => {
                        if (result === null){
                            reply('The event with the given code ' + req.params._id + ' does not exit').code(404);
                        }
                        reply(result).code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))
                );
        },
        config: {
            description: 'Gets all the information of a event',
            validate:{
                params: {
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-events-[0-9]+$/).required().example('AA-AAAA-AAA-events-1234')
                        .description('Code of the event to fetch')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-events-1234' },
                        '404': { 'description': 'The event with the given code does not exist' }
                    }
                }
            },
            response: { schema: EventsModel },
            tags: ['api', 'swagger']
        }
    }
];

