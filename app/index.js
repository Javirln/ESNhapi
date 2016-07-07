'use strict';

const Glue = require('glue');
const ManifestDev = require('./server/config/manifest.dev');
const ManifestProd = require('./server/config/manifest.prod');
const Jobs = require('./server/jobs');

const options = {
    relativeTo: __dirname
};

Glue.compose(ManifestDev, options, (err, server) => {

    if (err) {
        throw err;
    }
    server.start(() => {

        server.log('info', 'Server running at: ' + server.info.uri);
        Jobs(server); // Trigger the scheduled jobs
    });
});
