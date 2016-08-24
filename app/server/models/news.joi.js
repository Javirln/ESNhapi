'use strict';

const Joi = require('joi');
const CountryCode = require('./country.joi').code;
const CityCode = require('./city.joi').code;
const SectionCode = require('./section.joi').code;

const BaseSchema = Joi.object({
    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/)
        .example('AA-AAAA-AAA-news-1234')
        .description('Code of the new'),
    title: Joi.string()
        .example('Awesome title')
        .description('Title of the new'),
    content: Joi.any()
        .example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        .description('The body of the new'),
    createdOnSatellite: Joi.date()
        .example('2016-06-05T12:32:35+02:00')
        .description('Date when the new was created on Satellite'),
    lastUpdate: Joi.number()
        .example('1468776265810.0')
        .description('The timestamp about when it was fetched'),
    country: CountryCode,
    city: CityCode,
    section: SectionCode
})
    .label('News')
    .requiredKeys('code', 'title', 'content', 'country', 'city', 'section')
    .optionalKeys('createdOnSatellite', 'lastUpdate');

exports.base = BaseSchema;
exports.code = Joi.reach(BaseSchema, 'code');
