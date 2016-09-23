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
        Plugins.authSimpleToken,
        Plugins.registerGood,
        Plugins.registerInert,
        Plugins.registerVision,
        Plugins.registerSwagger,
    ]
};

module.exports = manifest;
