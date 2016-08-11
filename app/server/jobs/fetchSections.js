'use strict';

const Request = require('request-promise');
const Section = require('../models/section.mongoose').Model;
const Promise = require('bluebird');

//const CallhomeSectionURL = 'http://satellite.esn.org/callhome/api/section.json';
const CallhomeSectionURL = 'https://git.esn.org/snippets/13/raw';

const base_dir = './app/logs/';
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('sections.log'));

exports.schedule = (server) => {

    server.log('info', 'Updating Section List');
    toStore.write(new Date().toString() + ' [INFO] Updating Section list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeSectionURL,
        json: true,
        jar: true // Remember cookies!
    })
        .then((json) =>

                Promise.map(json, (section) =>

                    Section.findOneAndUpdate(
                        { code: section._id },
                        {
                            $set: {
                                url: section.url,
                                name: section.name,
                                country: section._id.split('-')[0],
                                address: section.address,
                                city: section.city
                            }
                        },
                        {
                            new: true,
                            upsert: true
                        })
                        .exec()
                        .then((created) => toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${created._doc.code} created\n`))
                        .catch((error) => console.log(error))
                )
                    .then(
                        () => {

                            toStore.write(new Date().toString() + ' [INFO] Successfully updated list of sections\n');
                            server.log('info', 'Successfully updated list of sections');
                        },
                        (error) => {

                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of sections:' + error + '\n');
                            server.log('error', 'Error updating list of sections:' + error);
                        }
                    )
            ,
            (error) => {

                console.log(error);
            }
        );
};

