'use strict';

const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

const CallhomeCityURL = 'https://git.esn.org/snippets/15/raw';

exports.schedule = (server) => {

    server.log('info', 'Updating City List');

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
                        });
                }))
                    .then(
                        (success) => {

                            server.log('info', 'Successfully updated list of cities');
                        },
                        (error) => {

                            server.log('error', 'Error updating list of cities:' + error);
                        }
                    );


            },
            (error) => {
                console.log(error);
            }
        );
};


