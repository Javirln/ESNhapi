'use strict';

module.exports = [
    {
        path: '/cities',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the cities');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities',
        method: 'POST',
        handler: (req, reply) => {

            reply('Create a city');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities',
        method: 'DELETE',
        handler: (req, reply) => {

            reply('Delete a city');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a city');
        },
        config: {
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
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Information of city with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/sections',
        method: 'GET',
        handler: (req, reply) => {

            reply('Section list of city with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated news list of city with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/cities/{code}/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('Aggregated events list of city with code ' + req.params.code);
        },
        config: {
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
            tags: ['api', 'swagger']
        }
    }
];

