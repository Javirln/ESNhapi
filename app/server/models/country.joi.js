'use strict';

const Joi = require('joi');

const BaseSchema = Joi.object({
    code: Joi.string().length(2).uppercase()
        .example('AA')
        .description('Code of the country'),
    url: Joi.string().uri()
        .example('html://esnantartica.org')
        .description('URL to the Country\'s ESN Homepage'),
    name: Joi.string()
        .example('ESN Antartica')
        .description('Full name of the country')
})
    .requiredKeys('code', 'name')
    .optionalKeys('url');

exports.base = BaseSchema;
exports.code = Joi.reach(BaseSchema, 'code');




