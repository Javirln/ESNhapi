'use strict';

const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

const CallhomeCityURL = 'https://git.esn.org/snippets/15/raw';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('cities.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating City List');
    toStore.write(new Date().toString() + ' [INFO] Updating city list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeCityURL,
        json: true,
        jar: true // Remember cookies!
    })
        .then(
            (json) => {

                const cities = server.mongo.db
                    .collection('cities');

                Promise.all(_.map(json, (city) => {

                    return cities.updateOne(
                        {
                            _id: city._id
                        },
                        OmitEmpty({
                            country: city.country,
                            name: city.name,
                            otherNames: city.otherNames
                        }),
                        {
                            upsert: true
                        }).then(toStore.write(new Date().toString() + ' [INFO] ' + ' [CITY-CODE] ' + city._id + ' created\n'));
                }))
                    .then(
                        (success) => {
                            toStore.write(new Date().toString() + ' [INFO] Successfully updated list of cities\n');
                            server.log('info', 'Successfully updated list of cities');
                        },
                        (error) => {
                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of cities:' + error + '\n');
                            server.log('error', 'Error updating list of cities:' + error);

                        }
                    );


            },
            (error) => {
                console.log(error);
            }
        );
};


