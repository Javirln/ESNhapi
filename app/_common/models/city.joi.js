'use strict';

const Joi = require('joi');
const CountryCode = require('./country.joi.js').code;

const BaseSchema = Joi.object({
    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,3}$/)
        .example('AA-AAA')
        .description('Code of the city'),
    country: CountryCode,
    name: Joi.string().required()
        .example('Antartica')
        .description('City name'),
    otherNames: Joi.array()
        .description('Other names of the city')
})
    .label('city')
    .requiredKeys('code', 'name', 'country')
    .optionalKeys('otherNames');

exports.base = BaseSchema;
exports.code = Joi.reach(BaseSchema, 'code');
