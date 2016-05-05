'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({ port: 3000 });

server.register(
    [
        require('./server/config/good').registerGood,
        require('./server/config/plugins').registerRouter
    ],

    (err) => {

        if (err) {
            throw err; // something bad happened loading Good
        }

        server.start(() => {

            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });

module.exports = server;
