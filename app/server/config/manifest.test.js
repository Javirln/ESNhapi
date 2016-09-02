'use strict';

const Plugins = require('./plugins');

const manifest = {
    server: {
        connections: {
            router: {
                stripTrailingSlash: true,
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
        Plugins.registerRouter,
        Plugins.registerInjectThen
    ]
};

module.exports = manifest;
