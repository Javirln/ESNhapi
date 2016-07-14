'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = [
    {
        path: '/countries',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;


            reply(db
                .collection('countries')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            description: 'Gets all ESN countries',
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db
                .collection('countries')
                .insertOne(req.payload)
                .then(
                    (result) => reply(result.result).code(201),
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
            description: 'Creates a new ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The country with the given code does not exist' },
                        '409': { 'description': 'There is already a country with that index' }
                    }
                }
            },
            validate: require('./validator')
        }
    },
    {
        path: '/countries/{code}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
            // Delete the sections underneath the country
                .resolve(db
                    .collection('sections')
                    .deleteMany({ country: req.params.code })
                )
                .then(() => db
                    .collection('countries')
                    .deleteOne({ _id: req.params.code })
                    .then(
                        (result) => {

                            if (result.result.n === 0) {
                                reply(result).code(404); // If no items deleted, return a 404
                            }
                            reply(result).code(200);
                        },
                        (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))));

        },
        config: {
            description: 'Deletes an ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given country is malformed, it must follow the pattern AA-AAAA' },
                        '404': { 'description': 'The country with the given code does not exist' }
                    }
                }
            },
            validate: {
                params: {
                    code: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country')
                }
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a country');
        },
        config: {
            description: 'Replaces an ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must contains all the fields' },
                        '404': { 'description': 'The country with the given code does not exist' }
                    }
                }
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a country');
        },
        config: {
            description: 'Updates an ESN country',
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db
                .collection('countries')
                .findOne({ _id: req.params.code })
                .then(
                    (result) => reply(result).code(200),
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))
                );

        },
        config: {
            description: 'Gets information from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
        path: '/countries/{code}/sections',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            Promise
                .resolve(db
                    .collection('countries')
                    .find({ _id: req.params.code })
                    .count()
                )
                .then((country) => {

                    if (country === 1) {
                        return Promise.resolve();
                    }
                    return Promise.reject(Boom.notFound('Country doesn\'t exist'));
                })
                .then(() => db
                    .collection('sections')
                    .find({ country: req.params.code })
                    .sort({ _id: 1 })
                    .toArray())
                .then(
                    (success) => reply(success).code(200),
                    (error) => reply(error)
                );
        },
        config: {
            description: 'Gets the sections belonging to a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
        path: '/countries/{code}/cities',
        method: 'GET',
        handler: (req, reply) => {

            reply('Cities list of country with code ' + req.params.code);
        },
        config: {
            description: 'Gets the cities belonging to a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
        path: '/countries/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated news list of country with code ' + req.params.code);
        },
        config: {
            description: 'Gets the news from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
        path: '/countries/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of country with code ' + req.params.code);
        },
        config: {
            description: 'Gets the events from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
        path: '/countries/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of country with code ' + req.params.code);
        },
        config: {
            description: 'Gets the partners found in a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA' },
                        '404': { 'description': 'The country with the given code does not exist' }
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
    }
];

