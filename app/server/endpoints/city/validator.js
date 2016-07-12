'use strict';

const Joi = require('joi');

module.exports = {
    payload: {
        _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).required().example('AA-AAAA')
            .description('Code of the city'),
        country: Joi.string().length(2).uppercase().required().example('AA')
            .description('Code of the country'),
        city: Joi.string().required().example('Antartica')
            .description('City name')
    }
};
