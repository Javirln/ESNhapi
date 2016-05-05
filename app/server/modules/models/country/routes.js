'use strict';

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

            reply('Create a country');
        },
        config: {
            tags: ['api', 'swagger']
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

