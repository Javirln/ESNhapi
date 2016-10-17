'use strict';

const Request = require('request-promise');
const Section = require('../../_common/models/section.mongoose').Model;
const Promise = require('bluebird');
const Cheerio = require('cheerio');

//const CallhomeSectionURL = 'http://satellite.esn.org/callhome/api/section.json';
const CallhomeSectionURL = 'http://galaxy.esn.org/sections/xml';

const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('sections.log'));

exports.schedule = () => {

    console.log('[INFO] Updating Section List');
    toStore.write(new Date().toString() + ' [INFO] Updating Section list from Galaxy endpoint\n');

    return Request({
        uri: CallhomeSectionURL,
        jar: true, // Remember cookies!
        transform: function (response){
            const $ = Cheerio.load(response, {
                xmlMode: true,
                normalizeWhitespace: true
            });
            const dict = $('sections');
            const sections = [];
            for (let i = 0; i < dict[0].children.length; i++){
                sections.push({
                    _id: dict[0].children[i].children[0].children[0].data,
                    url: dict[0].children[i].children[6].children[0].children[0].data,
                    name: dict[0].children[i].children[1].children[0].children[0].data,
                    country: dict[0].children[i].children[4].children[0].children[0].data,
                    address: dict[0].children[i].children[2].children[0].children[0].data,
                    city: dict[0].children[i].children[3].children[0].children[0].data
                });
            }
            return sections;
        }
    })
        .then((json) =>

                Promise.map(json, (section) =>

                    Section.findOneAndUpdate(
                        { code: section._id },
                        {
                            $set: {
                                url: section.url,
                                name: section.name,
                                country: section.country,
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
                            console.log('[INFO] Successfully updated list of sections');
                        },
                        (error) => {

                            toStore.write(new Date().toString() + ' [ERROR] Error updating list of sections:' + error + '\n');
                            console.log('[ERROR] Error updating list of sections:' + error);
                        }
                    )
            ,
            (error) => {

                console.log(error);
            }
        );
};

