'use strict';

const Plugins = require('./plugins');

const manifest = {
    server: {
        connections: {
            router: {
                stripTrailingSlash: true,
                // Although it's a bad practise, but can avoid future problems
                isCaseSensitive: false
            }
        }
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
