'use strict';

const DateExtend = require('date-extended');
const Request = require('request-promise');
const Partner = require('../../_common/models/partner.mongoose').Model;
const Promise = require('bluebird');

const BaseUrlPartners = 'api/v1/partners.json';

const Path = require('path');
const base_dir = Path.join(__dirname, 'logs/');
const GoodFile = require('good-file');
const toStore = new GoodFile(base_dir.concat('partners.log'));

exports.schedule = (validSections) => {

    console.log('[INFO] Getting section data: news');
    toStore.write(new Date().toString() + ' [INFO] Getting section data: partner\n');


    return processValidPartners(validSections)
        .then((result) => console.log('[INFO] Partner updated'));
};

// Update the partners of the ones that are online
const processValidPartners = (valid_sections) => {

    // Request all the partners from valid APIs
    return Promise.map(valid_sections,
        (valid_section) =>

            Request({
                uri: valid_section.url.concat(valid_section.url.endsWith('/') ? BaseUrlPartners : '/'.concat(BaseUrlPartners)),
                json: true,
                resolveWithFullResponse: true,
                jar: true
            })
            // Check the date
                .then((response) =>

                    Promise.map(response.body,
                        (content_partner) => {

                            const partnerDate = new Date(content_partner.created);

                            // Check if it's newer than 2 months ago
                            if (DateExtend.monthsAgo(2) < partnerDate) {
                                const code = valid_section.code + '-partners-' + content_partner.nid;

                                // Update the DB
                                return Partner.findOneAndUpdate(
                                    { code: code },
                                    {
                                        code: code,
                                        name: content_partner.title,
                                        moreInformation: content_partner.more_info.length === 0 ? [] : content_partner.more_info,
                                        content: content_partner.body,
                                        lastUpdate: Date.now()
                                    }, {
                                        upsert: true
                                    })
                                    .then(() => {

                                        toStore.write(`${new Date().toString()} [INFO] [SECTION-CODE] ${valid_section.code} || [PARTNER-ID] ${content_partner.nid} created\n`);
                                    });
                            }
                        },
                        { concurrency: 10 }
                    )
                )
                .catch((error) => console.log(`[ERROR] Error updating list of partners in section ${valid_section.code}. Error code ${error.statusCode}`))
    );
};
