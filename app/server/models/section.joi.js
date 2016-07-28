'use strict';

const Joi = require('joi');
const CountryCode = require('./country.joi').code;

const BaseSchema = Joi.object({
    code: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}$/)
        .example('AA-AAAA-AAAA')
        .description('Code of the section'),
    url: Joi.string().uri()
        .example('html://esnantartica.org')
        .description('URL to the Country\'s ESN Homepage'),
    name: Joi.string().required()
        .example('ESN Antartica')
        .description('Full name of the country'),
    country: CountryCode,
    address: Joi.string()
        .example('Iceberg n34, North Rock, Antartica')
        .description('Street address of the section'),
    city: Joi.string().required()
        .example('Antartica')
        .description('City of the section')
});

exports.base = BaseSchema;
exports.code = Joi.reach(BaseSchema, 'code');
