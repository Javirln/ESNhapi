'use strict';

const Request = require('request-promise');
const cheerio = require('cheerio');

const GalaxyCountryEndpoint = 'http://galaxy.esn.org/countries/xml';
const GalaxySectionsEndpoint = 'http://galaxy.esn.org/sections/xml';

exports.runGalaxyCountryEndpoint = () => {

    return Request({
        uri: GalaxyCountryEndpoint,
        jar: true
    }).then((xml) => {

        return countriesHelper(xml);

    }).catch((err) => {

        console.log(err);
    });
};

exports.runGalaxySectionsEndpoint = () => {

    return Request({
        uri: GalaxySectionsEndpoint,
        jar: true
    }).then((xml) => {

        return sectionsHelper(xml);

    }).catch((err) => {

        console.log(err);
    });
};

const countriesHelper = (xml) => {

    const $ = cheerio.load(xml, {
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
    return JSON.stringify(countries);
};

const sectionsHelper = (xml) => {

    const $ = cheerio.load(xml, {
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
    return JSON.stringify(sections);

};
