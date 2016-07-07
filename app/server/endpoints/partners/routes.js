'use strict';

module.exports = [
    {
        path: '/partners',
        method: 'GET',
        handler: (req, reply) => {

            reply('List of all the partners');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'POST',
        handler: (req, reply) => {

            reply('Create a partner');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'DELETE',
        handler: (req, reply) => {

            reply('Delete a partner');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'PUT',
        handler: (req, reply) => {

            reply('Update a partner');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a partner');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners/{id}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Information of partners with ID ' + req.params.code);
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

