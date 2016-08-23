'use strict';

const PartnersHandlers = require('../handlers/partners.handlers');
const PartnersSchema = require('../models/partners.joi.js');
const Errors = require('../models/errors').errors;
const Error200 = require('../models/errors').generate200;

module.exports = [
    {
        path: '/partners',
        method: 'GET',
        handler: PartnersHandlers.getAll,
        config: {
            description: 'Gets all partners',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(PartnersSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/partners',
        method: 'POST',
        handler: PartnersHandlers.create,
        config: {
            description: 'Creates partner',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': Errors.HTTP201,
                        '400': Errors.HTTP400,
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                payload: PartnersSchema.base
                    .requiredKeys('code', 'name', 'content')
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'DELETE',
        handler: PartnersHandlers.delete,
        config: {
            description: 'Deletes partner',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '204': Errors.HTTP204,
                        '400': Errors.HTTP400,
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: PartnersSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'PUT',
        handler: PartnersHandlers.replace,
        config: {
            description: 'Replaces partner',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: PartnersSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'PATCH',
        handler: PartnersHandlers.update,
        config: {
            description: 'Updates partner',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: PartnersSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'GET',
        handler: PartnersHandlers.getOne,
        config: {
            description: 'Gets a specific partner',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(PartnersSchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: PartnersSchema.code
                }
            }
        }
    }
];

