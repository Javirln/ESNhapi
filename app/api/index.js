'use strict';

const Glue = require('glue');
const ManifestDev = require('./config/manifest.dev.js');
const ManifestProd = require('./config/manifest.prod.js');

// DB Config
require('../_common/config/db');

// AUTHORIZATION
const SimpleToken = require('./config/auth/auth-simple-token').setup;

let Manifest = '';
if (process.env.NODE_ENV === 'production') {
    Manifest = ManifestProd;
}
else {
    Manifest = ManifestDev;
}

const options = {
    relativeTo: __dirname
};

Glue.compose(Manifest, options, (err, server) => {

    if (err) {
        throw err;
    }

    // REGISTER AUTHENTICATION
    SimpleToken(server);

    // REGISTER THE ROUTES
    server.register(require('./config/plugins').registerRouter.plugin,
        (err) => {

            if (err) {
                throw err;
            }

            server.start(() => {

                server.log('info', 'Server running at: ' + server.info.uri);
            });
        });

});
