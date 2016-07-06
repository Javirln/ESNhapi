'use strict';

const Joi = require('joi');

module.exports = {
    payload: {
        _id: Joi.string().length(2).uppercase().required().example('AA')
            .description('Code of the country'),
        url: Joi.string().uri().required().example('html://esnantartica.org')
            .description('URL to the Country\'s ESN Homepage')
    }
};
