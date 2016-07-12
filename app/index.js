'use strict';

const Glue = require('glue');
const ManifestDev = require('./server/config/manifest.dev');
const ManifestProd = require('./server/config/manifest.prod');
const Jobs = require('./server/jobs');

let Manifest = '';
if (process.env.NODE_ENV !== 'production') {
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
    server.start(() => {

        server.log('info', 'Server running at: ' + server.info.uri);
        if (process.env.NODE_ENV !== 'test') {
            Jobs(server); // Trigger the scheduled jobs
        }
    });
});
