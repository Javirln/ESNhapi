'use strict';

const Joi = require('joi');
const CountryCode = require('./country.joi.js').code;
const CityCode = require('./city.joi.js').code;
const SectionCode = require('./section.joi.js').code;

const BaseSchema = Joi.object({
    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/)
        .example('AA-AAAA-AAA-partners-1234')
        .description('Code of the new'),

    name: Joi.string()
        .example('Awesome partner name')
        .description('Name of the partner'),

    content: Joi.any()
        .example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        .description('Partner\'s description'),

    moreInformation: Joi.any()
        .example('Bar\'s website')
        .description('Links to more information'),

    lastUpdate: Joi.date().timestamp()
        .example('1468776265810')
        .description('The timestamp about when it was fetched'),

    country: CountryCode,

    city: CityCode,

    section: SectionCode
})
    .label('Partner')
    .requiredKeys('code', 'name', 'content', 'country', 'city', 'section');

exports.base = BaseSchema;
exports.code = Joi.reach(BaseSchema, 'code');
