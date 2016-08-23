'use strict';

const PartnerHandlers = require('../handlers/partner.handlers');
const PartnerSchema = require('../models/partner.joi.js');
const Errors = require('../models/errors').errors;
const Error200 = require('../models/errors').generate200;

module.exports = [
    {
        path: '/partners',
        method: 'GET',
        handler: PartnerHandlers.getAll,
        config: {
            description: 'Gets all news',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(PartnerSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/partners',
        method: 'POST',
        handler: PartnerHandlers.create,
        config: {
            description: 'Creates news',
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
                payload: PartnerSchema.base
                    .requiredKeys('code', 'name', 'content')
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'DELETE',
        handler: PartnerHandlers.delete,
        config: {
            description: 'Deletes news',
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
                    code: PartnerSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'PUT',
        handler: PartnerHandlers.replace,
        config: {
            description: 'Replaces news',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: PartnerSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'PATCH',
        handler: PartnerHandlers.update,
        config: {
            description: 'Updates news',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: PartnerSchema.code
                }
            }
        }
    },
    {
        path: '/partners/{code}',
        method: 'GET',
        handler: PartnerHandlers.getOne,
        config: {
            description: 'Gets a specific news',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(PartnerSchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: PartnerSchema.code
                }
            }
        }
    }
];

