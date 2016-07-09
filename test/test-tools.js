'use strict';

const Glue = require('glue');
const MongoClient = require('mongodb').MongoClient;
const ManifestTest = require('../app/server/config/manifest.test');

const glueOptions = {
    relativeTo: __dirname
};

let Server = {};

exports.setup = () => {

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

    return new Promise(( resolve, error) => {

        MongoClient.connect('mongodb://mongo:27017/esnhapi', (err, db) => {

            if (err) {
                error(err);
            }
            db.dropCollection(collectionName, () => {

                db.close();
                resolve();
            });
        });
    });
};


exports.teardown = (done) => {
    // Close the server after all tests
    Server.stop();
    done();
};

