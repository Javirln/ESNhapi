'use strict';

const Plugins = require('./plugins');
const GlobPlugins = require('../../_common/config/plugins');

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
        Plugins.authSimpleToken,
        GlobPlugins.registerInjectThen
    ]
};

module.exports = manifest;
