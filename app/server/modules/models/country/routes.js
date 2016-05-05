'use strict';

module.exports = [
    {
        path: '/',
        method: 'GET',
        handler: (req, reply) => {

            reply('Hello hapi API');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/{name}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Hello this is someone called ' + req.params.name + '!');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/test1',
        method: 'GET',
        handler: (req, reply) => {

            reply('hello, this is test 1');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/test2',
        method: 'GET',
        handler: (req, reply) => {

            reply('hello, this is test 2');
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

