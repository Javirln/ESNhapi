'use strict';

const Joi = require('joi');

module.exports = Joi.object({
    _id: Joi.string().required().example('AA-AAAA')
        .description('Code of the city'),
    country: Joi.string().required().example('AA')
        .description('Code of the country'),
    name: Joi.string().required().example('Antartica')
        .description('City name'),
    otherNames: Joi.array().items(Joi.string())
        .description('Other names of the city')
}).label('City');