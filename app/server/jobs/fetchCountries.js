'use strict';

const Request = require('request-promise');
const Country = require('../models/country.mongoose').Model;
const Promise = require('bluebird');

//const CallhomeCountryURL = 'http://satellite.esn.org/callhome/api/country.json';
const CallhomeCountryURL = 'https://git.esn.org/snippets/14/raw';


// Logging
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
        .then((json) =>

                Promise.map(json, (country) =>

                            Country.findOneAndUpdate(
                                { code: country._id },
                                {
                                    $set: {
                                        url: country.url,
                                        name: country.name
                                    }
                                },
                                {
                                    new: true,
                                    upsert: true
                                })
                                .exec()
                                .then((created) => toStore.write(`${new Date().toString()} [INFO] [COUNTRY-CODE] ${created._doc.code} created\n`))
                                .catch((error) => console.log(error))
                    )
                    .then(
                        () => {

                            toStore.write(new Date().toString() + ' [INFO] Successfully updated list of countries\n');
                            server.log('info', 'Successfully updated list of countries');
                        },
                        (error) => {

                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of countries:' + error + '\n');
                            server.log('error', 'Error updating list of countries:' + error);
                        }
                    )
            ,
            (error) => {

                console.log(error);
            }
        );
};
