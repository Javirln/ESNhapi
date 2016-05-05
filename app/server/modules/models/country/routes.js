'use strict';

module.exports = [
    {
        path: '/',
        method: 'GET',
        handler: (req, reply) => {

            reply('Hello hapi API');
        }
    },
    {
        path: '/{name*}',
        method: 'GET',
        handler: (req, reply) => {

            reply('Hello this is someone called ' + req.params.name + '!');
        }
    },
    {
        path: '/test1',
        method: 'GET',
        handler: (req, reply) => {

            reply('hello, this is test 1');
        }
    },
    {
        path: '/test2',
        method: 'GET',
        handler: (req, reply) => {

            reply('hello, this is test 2');
        }
    }
];

