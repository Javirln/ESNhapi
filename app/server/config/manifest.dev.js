'use strict';

const Plugins = require('./plugins');

const manifest = {
    server: {
    },
    connections: [
        {
            port: 3000
        }
    ],
    registrations: [
        Plugins.registerGood,
        Plugins.registerRouter,
        Plugins.registerInert,
        Plugins.registerVision,
        Plugins.registerSwagger,
        Plugins.registerBlipp
    ]
};

module.exports = manifest;
