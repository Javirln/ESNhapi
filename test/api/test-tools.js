'use strict';

const Glue = require('glue');
const MongoClient = require('mongodb').MongoClient;
const ManifestTest = require('../../app/api/config/manifest.test');
const dbURI = 'mongodb://mongo:27017/esnhapi-test';
const ClearDB  = require('mocha-mongoose')(dbURI);

const glueOptions = {
    relativeTo: __dirname
};

let Server = {};

exports.setup = () => {

    require('../../app/_common/config/db');

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

exports.clearDatabase = (done) => {

    ClearDB(done);
};


exports.teardown = () => {

    return new Promise(( resolve, error) => {

        MongoClient.connect(dbURI, (err, db) => {

            if (err) {
                error(err);
            }
            Server.stop();
            resolve();
        });
    });
};

