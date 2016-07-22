'use strict';

const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

//const CallhomeCountryURL = 'http://satellite.esn.org/callhome/api/country.json';
const CallhomeCountryURL = 'https://git.esn.org/snippets/14/raw';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('countries.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating Country List');
    toStore.write(new Date().toString() + ' [INFO] Updating Country list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeCountryURL,
        json: true,
        jar: true // Remember cookies!
    })
        .then(
            (json) => {

                const countries = server.mongo.db
                    .collection('countries');

                Promise.all(_.map(json, (country) => {

                    return countries.updateOne(
                        {
                            _id: country._id
                        },
                        OmitEmpty({
                            url: country.url,
                            name: country.name
                        }),
                        {
                            upsert: true
                        }).then(toStore.write(new Date().toString() + ' [INFO] ' + ' [COUNTRY-CODE] ' + country._id + ' created\n'));
                }))
                    .then(
                        (success) => {
                            toStore.write(new Date().toString() + ' [INFO] Successfully updated list of countries\n');
                            server.log('info', 'Successfully updated list of countries');
                        },
                        (error) => {
                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of countries:' + error + '\n');
                            server.log('error', 'Error updating list of countries:' + error);
                        }
                    );


            },
            (error) => {
                console.log(error);
            }
        );
};

