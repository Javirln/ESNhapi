'use strict';

const Boom = require('boom');
const Joi = require('joi');
const CityModel = require('./model');
const SectionModel = require('../sections/model');
const NewsModel = require('../news/model');
const EventsModel = require('../events/model');

module.exports = [
    {
        path: '/cities',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            reply(db
                .collection('cities')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            description: 'Gets all ESN cities',
            response: { schema: Joi.array().items(CityModel).label('Cities') },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('countries')
                .find({ _id: req.payload.country })
                .count()
                .then((country) => {
                    if (country !== 1) {
                        reply(Boom.forbidden(`The parent country ${req.payload.country} doesn't exist`));
                        return Promise.reject();
                    }
                })
                .then(() => db.collection('cities').insertOne(req.payload))
                .then((result) => reply('City successfully created').code(201))
                .catch((err) => {

                    if (err) {
                        if (err.code === 11000) {
                            return reply(Boom.conflict('Duplicated index', err.errmsg));
                        }
                        return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                    }
                });
        },
        config: {
            description: 'Creates a new ESN city',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city'),
                    country: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country'),
                    name: Joi.string().required().example('Antartica')
                        .description('City name'),
                    otherNames: Joi.array()
                        .description('Other names of the city')
                }).required().label('City')
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The city with the given code does not exist' },
                        '409': { 'description': 'There is already a city with that index' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('cities')
                .deleteOne({ _id: req.params.code })
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The city with code ' + req.params.code + ' does not exist').code(404); // If no items deleted, return a 404
                        }
                        reply('City successfully removed').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Deletes an ESN city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/',
        method: 'PUT',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('cities')
                .replaceOne(
                    { _id: req.payload._id },
                    req.payload
                )
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The city with code ' + req.params.code + ' does not exist').code(404);
                        }
                        reply('City successfully updated').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Replaces an ESN city',
            notes: 'All values must be filled although they are not to be changed',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city'),
                    country: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country'),
                    name: Joi.string().required().example('Antartica')
                        .description('City name'),
                    otherNames: Joi.array()
                        .description('Other names of the city')
                }).required().label('City')
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
        path: '/cities',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a city');
        },
        config: {
            description: 'Updates an ESN city',
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('cities')
                .findOne({ _id: req.params.code })
                .then(
                    (result) => reply(result).code(200),
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))
                );
        },
        config: {
            description: 'Gets information from an specific ESN city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city to fetch')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            response: { schema: CityModel },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/sections',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
                .resolve(db
                    .collection('cities')
                    .find({ _id: req.params.code })
                    .count()
                )
                .then((city) => {

                    if (city === 1) {
                        return Promise.resolve();
                    }
                    return Promise.reject(Boom.notFound('City doesn\'t exist'));
                })
                .then(() => db
                    .collection('sections')
                    .find({ _id: { $regex: '.*'.concat(req.params.code, '.*') } })
                    .sort({ _id: 1 })
                    .toArray())
                .then(
                    (success) => reply(success).code(200),
                    (error) => reply(error)
                );
        },
        config: {
            description: 'Gets the sections belonging to a specific ESN city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city to fetch sections from')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            response: {
                schema: Joi.array().items(SectionModel).label('Sections')
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
                .resolve(db
                    .collection('cities')
                    .find({ _id: req.params.code })
                    .count()
                )
                .then((city) => {

                    if (city === 1) {
                        return Promise.resolve();
                    }
                    return Promise.reject(Boom.notFound('City doesn\'t exist'));
                })
                .then(() => db
                    .collection('news')
                    .find({ _id: { $regex: '.*'.concat(req.params.code, '.*') } })
                    .sort({ _id: 1 })
                    .toArray())
                .then(
                    (success) => reply(success).code(200),
                    (error) => reply(error)
                );
        },
        config: {
            description: 'Gets all news belonging to a city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city to fetch news from')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            response: {
                schema: Joi.array().items(NewsModel).label('News')
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
                .resolve(db
                    .collection('cities')
                    .find({ _id: req.params.code })
                    .count()
                )
                .then((city) => {

                    if (city === 1) {
                        return Promise.resolve();
                    }
                    return Promise.reject(Boom.notFound('City doesn\'t exist'));
                })
                .then(() => db
                    .collection('events')
                    .find({ _id: { $regex: '.*'.concat(req.params.code, '.*') } })
                    .sort({ _id: 1 })
                    .toArray())
                .then(
                    (success) => reply(success).code(200),
                    (error) => reply(error)
                );
        },
        config: {
            description: 'Gets all events belonging to a city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city to fetch events from')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            response: {
                schema: Joi.array().items(EventsModel).label('Events') //To be implemented
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of city with code ' + req.params.code);
        },
        config: {
            description: 'Gets all partners belonging to a city',
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the city to fetch events from')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            response: {
                schema: Joi.array().items(EventsModel).label('Events') //To be implemented
            },
            tags: ['api', 'swagger']
        }
    }
];
