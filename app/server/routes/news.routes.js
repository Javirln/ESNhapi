'use strict';

const NewsHandlers = require('../handlers/news.handlers');
const NewsSchema = require('../models/news.joi.js');
const Errors = require('../models/errors').errors;
const Error200 = require('../models/errors').generate200;

module.exports = [
    {
        path: '/news',
        method: 'GET',
        handler: NewsHandlers.getAll,
        config: {
            description: 'Gets all news',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(NewsSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/news',
        method: 'POST',
        handler: NewsHandlers.create,
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
                payload: NewsSchema.base
                    .requiredKeys('code', 'title', 'content')
            }
        }
    },
    {
        path: '/news/{code}',
        method: 'DELETE',
        handler: NewsHandlers.delete,
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
                    code: NewsSchema.code
                }
            }
        }
    },
    {
        path: '/news/{code}',
        method: 'PUT',
        handler: NewsHandlers.replace,
        config: {
            description: 'Replaces news',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: NewsSchema.code
                }
            }
        }
    },
    {
        path: '/news/{code}',
        method: 'PATCH',
        handler: NewsHandlers.update,
        config: {
            description: 'Updates news',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: NewsSchema.code
                }
            }
        }
    },
    {
        path: '/news/{code}',
        method: 'GET',
        handler: NewsHandlers.getOne,
        config: {
            description: 'Gets a specific news',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(NewsSchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: NewsSchema.code
                }
            }
        }
    }
];

