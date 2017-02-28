'use strict';

const Request = require('request-promise');
const City = require('../../_common/models/city.mongoose').Model;
const Promise = require('bluebird');

const CallhomeCityURL = 'https://git.esn.org/snippets/15/raw';

const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('cities.log'));

exports.schedule = () => {

    console.log('[INFO] Updating City List');
    toStore.write(new Date().toString() + ' [INFO] Updating City list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeCityURL,
        json: true,
        jar: true // Remember cookies!
    })
        .then((json) =>

                Promise.map(json, (city) =>

                    City.findOneAndUpdate(
                        { code: city._id },
                        {
                            $set: {
                                country: city.country,
                                name: city.name,
                                otherNames: city.otherNames
                            }
                        },
                        {
                            new: true,
                            upsert: true
                        })
                        .exec()
                        .then((created) => toStore.write(`${new Date().toString()} [INFO] [CITY-CODE] ${created._doc.code} created\n`))
                        .catch((error) => console.log(error))
                    )
                    .then(
                        () => {

                            toStore.write(new Date().toString() + ' [INFO] Successfully updated list of cities\n');
                            console.log('[INFO] Successfully updated list of cities');
                        }
                    )
                    .catch((error) => {

                        toStore.write(new Date().toString() + ' [ERROR] Error updating list of cities:' + error + '\n');
                        console.log('[ERROR] Error updating list of cities:' + error);
                    })
        )
        .catch((error) => console.log(error));
};


