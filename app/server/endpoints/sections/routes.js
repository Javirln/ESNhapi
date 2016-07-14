'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = [
    {
        path: '/sections',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;


            reply(db
                .collection('sections')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            description: 'Gets all ESN sections',
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
                .resolve(db
                    .collection('countries')
                    .find({ _id: req.payload.country })
                    .count()
                )
                .then((country) => {

                    if (country === 1) {
                        return Promise.resolve();
                    }
                    return Promise.reject('Country doesn\'t exist');
                })
                .then(() => db
                    .collection('sections')
                    .insertOne(req.payload)
                )
                .then(
                    (success) => reply(success.result).code(201),
                    (error) => {

                        if (error) {
                            if (error.code === 11000) {
                                return reply(Boom.conflict('Duplicated index', error));
                            }
                            if (error.errmsg) {
                                return reply(Boom.internal('Internal MongoDB error', error));
                            }
                            return reply(Boom.forbidden('Country doesn\'t exist', error));

                        }
                    }
                );

        },
        config: {
            description: 'Creates a new ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The section with the given code does not exist' },
                        '409': { 'description': 'There is already a section with that index' }
                    }
                }
            },
            validate: require('./validator')
        }
    },
    {
        path: '/sections/{code}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('sections')
                .deleteOne({ _id: req.params.code })
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply(result).code(404); // If no items deleted, return a 404
                        }
                        reply(result).code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Deletes an ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given section is malformed, it must follow the pattern AA-AAAA-AAAA' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            },
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
                        .description('Code of the section')
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a section');
        },
        config: {
            description: 'Replaces an ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must contains all the fields' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            },
            validate: {
                params: {
                    code: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country to fetch')
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a section');
        },
        config: {
            description: 'Updates an ESN section',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country to fetch')
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('sections')
                .findOne({ _id: req.params.code })
                .then(
                    (result) => {

                        reply(result).code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Gets information from an specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAAA' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            },
            validate: {
                params: {
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}$/).required().example('AA-AAAA-AAAA')
                        .description('Code of the section')
                }
            }
        }
    },
    {
        path: '/sections/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated news list of section with code ' + req.params.code);
        },
        config: {
            description: 'Gets the news from a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAAA' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            }
        }
    },
    {
        path: '/sections/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of section with code ' + req.params.code);
        },
        config: {
            description: 'Gets the events from a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAAA' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            }
        }
    },
    {
        path: '/sections/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of section with code ' + req.params.code);
        },
        config: {
            description: 'Gets the partners found in a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAAA' },
                        '404': { 'description': 'The section with the given code does not exist' }
                    }
                }
            }
        }
    }
];

