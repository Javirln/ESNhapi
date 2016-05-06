'use strict';

const Joi = require('joi');

module.exports = {
    payload: {
        code: Joi.string().length(2).uppercase().required(),
        url: Joi.string().min(10).max(50).required()
    }
};
