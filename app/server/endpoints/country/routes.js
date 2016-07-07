'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = [
    {
        path: '/countries',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;


            reply(db.collection('countries').find({}).toArray()).code(200);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('countries')
                .insertOne({
                    _id: req.payload._id,
                    url: req.payload.url
                })
                .then(
                    (result) => {

                        reply(result.result).code(201);
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
            tags: ['api', 'swagger'],
            validate: require('./validator')
        }
    },
    {
        path: '/countries',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('countries')
                .deleteOne({
                    _id: req.payload.code
                })
                .then(
                    (result) => {

                        reply(result).code(201);
                    },
                    (err) => {

                        return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                    });
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a country');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a country');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('countries')
                .findOne({
                    _id: req.params.code
                })
                .then(
                    (result) => {

                        reply(result).code(200);
                    },
                    (err) => {

                        return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                    });

        },
        config: {
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
        path: '/countries/{code}/sections',
        method: 'GET',
        handler: (req, reply) => {

            reply('Section list of country with code ' + req.params.code);
        },
        config: {
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
        path: '/countries/{code}/cities',
        method: 'GET',
        handler: (req, reply) => {

            reply('Cities list of country with code ' + req.params.code);
        },
        config: {
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
        path: '/countries/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated news list of country with code ' + req.params.code);
        },
        config: {
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
        path: '/countries/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of country with code ' + req.params.code);
        },
        config: {
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
        path: '/countries/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: Joi.string().length(2).uppercase().required().example('AA')
                        .description('Code of the country to fetch')
                }
            }
        }
    }
];

