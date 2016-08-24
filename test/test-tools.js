'use strict';

const Glue = require('glue');
const MongoClient = require('mongodb').MongoClient;
const ManifestTest = require('../app/server/config/manifest.test');

const glueOptions = {
    relativeTo: __dirname
};

let Server = {};

exports.setup = () => {

    require('../app/server/config/db');

    return new Promise((resolve) => {

        Glue.compose(ManifestTest, glueOptions, (err, server) => {

            if (err) {
                throw err;
            }
            server.start(() => {

                Server = server;
                resolve(server);
            });
        });
    });

};

exports.clearDatabase = () => {

    return require('../app/server/models/country.mongoose').Model.remove({})
        .then(() => require('../app/server/models/section.mongoose').Model.remove({}) )
        .then(() => require('../app/server/models/city.mongoose').Model.remove({}) )
        .then(() => require('../app/server/models/news.mongoose').Model.remove({}) )
        .then(() => require('../app/server/models/partner.mongoose').Model.remove({}) )
        .then(() => require('../app/server/models/event.mongoose').Model.remove({}) )
};


exports.teardown = () => {

    return new Promise(( resolve, error) => {

        MongoClient.connect('mongodb://mongo:27017/esnhapi-test', (err, db) => {

            if (err) {
                error(err);
            }
            Server.stop();
            resolve();
        });
    });
};

