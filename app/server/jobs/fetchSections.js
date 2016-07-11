'use strict';

const Request = require('request-promise');
const _ = require('lodash');
const OmitEmpty = require('omit-empty');

const CallhomeSectionURL = 'http://satellite.esn.org/callhome/api/section.json';

exports.schedule = (server) => {

    server.log('info', 'Updating Section List');

    return Request({
        uri: CallhomeSectionURL,
        json: true,
        jar: true // Remember cookies!
    })
        .then(
            (json) => {

                const sections = server.mongo.db
                    .collection('sections');

                Promise.all(_.map(json, (section) => {

                    return sections.updateOne(
                        {
                            _id: section.code
                        },
                        OmitEmpty({
                            url: section.website,
                            name: section.name,
                            country: section.code.split('-')[0]
                        }),
                        {
                            upsert: true
                        });
                }))
                    .then(
                        (success) => {

                            server.log('info', 'Successfully updated list of sections');
                        },
                        (error) => {

                            server.log('error', 'Error updating list of sections:' + error);
                        }
                    );


            },
            (error) => {
                console.log(error);
            }
        );
};

