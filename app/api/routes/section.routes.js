'use strict';

const SectionHandlers = require('../handlers/section.handlers');
const SectionSchema = require('../../_common/models/section.joi.js');
const Errors = require('../../_common/models/errors').errors;
const Error200 = require('../../_common/models/errors').generate200;

module.exports = [
    {
        path: '/sections',
        method: 'GET',
        handler: SectionHandlers.getAll,
        config: {
            description: 'Gets all ESN sections',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(SectionSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/sections',
        method: 'POST',
        handler: SectionHandlers.create,
        config: {
            description: 'Creates a new ESN country',
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
                payload: SectionSchema.base
                    .requiredKeys('code', 'name')
                    .optionalKeys('url')
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'DELETE',
        handler: SectionHandlers.delete,
        config: {
            description: 'Deletes an ESN section',
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
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'PUT',
        handler: SectionHandlers.replace,
        config: {
            description: 'Replaces an ESN section',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'PATCH',
        handler: SectionHandlers.update,
        config: {
            description: 'Updates an ESN section',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}',
        method: 'GET',
        handler: SectionHandlers.getOne,
        config: {
            description: 'Gets information from a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(SectionSchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}/news',
        method: 'GET',
        handler: SectionHandlers.getNews,
        config: {
            description: 'Gets the news from a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(SectionSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}/events',
        method: 'GET',
        handler: SectionHandlers.getEvents,
        config: {
            description: 'Gets the events from a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(SectionSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    },
    {
        path: '/sections/{code}/partners',
        method: 'GET',
        handler: SectionHandlers.getPartners,
        config: {
            description: 'Gets the partners found in a specific ESN section',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(SectionSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: SectionSchema.code
                }
            }
        }
    }
];

