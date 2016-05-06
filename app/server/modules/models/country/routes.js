'use strict';

const Boom = require('boom');

module.exports = [
    {
        path: '/countries',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the countries');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.plugins['hapi-mongodb'].db;

            db.collection('countries').insert(
                {
                    _id: req.payload.code,
                    code: req.payload.code,
                    url: req.payload.url
                },
                (err, result) => {

                    if (err) {
                        if (err.code === 11000) {
                            return reply(Boom.conflict('Duplicated index', err.errmsg));
                        }
                        return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                    }
                    reply(result).code(201);
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

            reply('Delete a country');
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

            reply('Information of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}/sections',
        method: 'GET',
        handler: (req, reply) => {

            reply('Section list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}/cities',
        method: 'GET',
        handler: (req, reply) => {

            reply('Cities list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated news list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/countries/{code}/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated partners list of country with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

