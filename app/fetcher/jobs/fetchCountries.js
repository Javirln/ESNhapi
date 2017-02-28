'use strict';

const Request = require('request-promise');
const Country = require('../../_common/models/country.mongoose').Model;
const Promise = require('bluebird');
const Cheerio = require('cheerio');

const CallhomeCountryURL = 'http://galaxy.esn.org/countries/xml';

// Logging
const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('countries.log'));

exports.schedule = () => {

    console.log('[INFO] Updating Country List');
    toStore.write(new Date().toString() + ' [INFO] Updating Country list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeCountryURL,
        jar: true, // Remember cookies!
        transform: function (response){
            const $ = Cheerio.load(response, {
                xmlMode: true,
                normalizeWhitespace: true
            });
            const dict = $('countries');
            const countries = [];
            for (let i = 0; i < dict[0].children.length; i++){
                countries.push({
                    _id: dict[0].children[i].children[0].children[0].data,
                    name: dict[0].children[i].children[1].children[0].children[0].data,
                    url: dict[0].children[i].children[2].children[0].children[0].data
                });
            }
            return countries;
        }
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
                            console.log('[INFO] Successfully updated list of countries');
                        },
                        (error) => {

                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of countries:' + error + '\n');
                            console.log('[ERROR] Error updating list of countries:' + error);
                        }
                    )
            ,
            (error) => {

                console.log(error);
            }
        );
};
