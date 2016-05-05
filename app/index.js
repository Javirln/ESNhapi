'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/{yourname*}',
    handler: (req, reply) => {

        reply('Hello this is someone called ' + req.params.yourname + '!');
    }
});

server.register(
    require('./server/config/good').register,

    (err) => {

        if (err) {
            throw err; // something bad happened loading Good
        }

        server.start( () => {

            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });

module.exports = server;
