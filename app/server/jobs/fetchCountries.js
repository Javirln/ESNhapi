'use strict';

const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

//const CallhomeCountryURL = 'http://satellite.esn.org/callhome/api/country.json';
const CallhomeCountryURL = 'https://git.esn.org/snippets/14/raw';

exports.schedule = (server) => {

    server.log('info', 'Updating Country List');

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
                            _id: country.code
                        },
                        OmitEmpty({
                            url: country.website,
                            name: country.name
                        }),
                        {
                            upsert: true
                        });
                }))
                    .then(
                        (success) => {

                            server.log('info', 'Successfully updated list of countries');
                        },
                        (error) => {

                            server.log('error', 'Error updating list of countries:' + error);
                        }
                    );


            },
            (error) => {
                console.log(error);
            }
        );
};

