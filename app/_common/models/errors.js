'use strict';

const Boom = require('boom');
const Joi = require('joi');

const error = (code, description, empty) => {

    let schema = {};

    if (!empty) {
        schema = Joi.object({
            statusCode: Joi.number()
                .example(code)
                .description('HTTP error code'),
            error: Joi.string()
                .example(description)
                .description('Error'),
            message: Joi.string()
                .example('Error description')
                .description('Error description')
        });
    }

    return {
        description: description,
        schema: schema
    };
};

exports.errors = {
    'HTTP201': error(201, 'Created', true),
    'HTTP204': error(204, 'No Content', true),
    'HTTP400': error(400, Boom.badRequest().output.payload.error),
    'HTTP404': error(404, Boom.notFound().output.payload.error),
    'HTTP409': error(409, Boom.conflict().output.payload.error),
    'HTTP500': error(500, Boom.internal().output.payload.error)
};

exports.generate200 = (schema, isArray) => {

    const result = {
        description: 'Success'
    };

    if (isArray) {
        result.schema = Joi.array().items(schema);
    }
    else {
        result.schema = schema;
    }

    return result;

};
