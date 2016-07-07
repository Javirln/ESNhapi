'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = [
    {
        path: '/sections',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;


            reply(db.collection('sections').find({}).sort( { _id: 1 } ).toArray()).code(200);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('sections')
                .insertOne(req.payload)
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
                    (err) => {

                        return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                    });
        },
        config: {
            tags: ['api', 'swagger'],
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
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a section');
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
        path: '/sections/{code}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('sections')
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
                    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
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
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of section with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of section with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

