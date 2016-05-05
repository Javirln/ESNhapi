'use strict';

module.exports = [
    {
        path: '/sections',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the sections');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'POST',
        handler: (req, reply) => {

            reply('Create a section');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'DELETE',
        handler: (req, reply) => {

            reply('Delete a section');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a section');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a section');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/sections/{code}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Information of section with code ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
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

