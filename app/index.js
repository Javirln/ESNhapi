'use strict';

const Hapi = require('hapi');

const Plugins = require('./server/config/plugins');
const Inert = require('inert');
const Vision = require('vision');

const server = new Hapi.Server();

server.connection({ port: 3000 });

server.register(
    [
        Plugins.registerGood,
        Plugins.registerRouter,
        Plugins.registerBlipp,
        Inert,
        Vision,
        Plugins.registerSwagger
    ],

    (err) => {

        if (err) {
            throw err; // something bad happened loading plugins
        }

        server.start(() => {

            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });

module.exports = server;
