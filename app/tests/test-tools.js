'use strict';

const Test = require('tape');
const Glue = require('glue');
const MongoClient = require('mongodb').MongoClient;
const ManifestTest = require('../server/config/manifest.test');

const glueOptions = {
    relativeTo: __dirname
};

let Server = {};

exports.setup = (cb) => {

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


exports.clearCollection = (collectionName) => {

    Test('[Tool] Clear collection ' + collectionName, (t) => {

        MongoClient.connect('mongodb://mongo:27017/test', (err, db) => {

            if (err) {
                t.fail(err);
            }
            db.dropCollection(collectionName, () => {

                db.close();
                t.end();
            });
        });
    });
};


exports.teardown = () => {
    // Close the server after all tests
    Test('Teardown', (t) => {

        Server.stop();
        t.end();
    });
};

