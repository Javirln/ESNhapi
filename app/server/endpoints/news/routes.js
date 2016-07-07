'use strict';

module.exports = [
    {
        path: '/news',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the news');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'POST',
        handler: (req, reply) => {

            reply('Create a news');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'DELETE',
        handler: (req, reply) => {

            reply('Delete a news');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a news');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a news');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news/{id}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Information of news with ID ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

