'use strict';

module.exports = [
    {
        path: '/events',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the events');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'POST',
        handler: (req, reply) => {

            reply('Create a event');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'DELETE',
        handler: (req, reply) => {

            reply('Delete a event');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/events',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a event');
        },
        config: {
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
        path: '/events/{id}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Information of events with ID ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

