'use strict';

const EventsHandlers = require('../handlers/event.handlers.js');
const EventsSchema = require('../../_common/models/event.joi.js');
const Errors = require('../../_common/models/errors').errors;
const Error200 = require('../../_common/models/errors').generate200;

module.exports = [
    {
        path: '/events',
        method: 'GET',
        handler: EventsHandlers.getAll,
        config: {
            description: 'Gets all events',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(EventsSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/events',
        method: 'POST',
        handler: EventsHandlers.create,
        config: {
            description: 'Creates events',
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
                payload: EventsSchema.base
                    .requiredKeys('code', 'title', 'dateStarts')
            }
        }
    },
    {
        path: '/events/{code}',
        method: 'DELETE',
        handler: EventsHandlers.delete,
        config: {
            description: 'Deletes events',
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
                    code: EventsSchema.code
                }
            }
        }
    },
    {
        path: '/events/{code}',
        method: 'PUT',
        handler: EventsHandlers.replace,
        config: {
            description: 'Replaces events',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: EventsSchema.code
                }
            }
        }
    },
    {
        path: '/events/{code}',
        method: 'PATCH',
        handler: EventsHandlers.update,
        config: {
            description: 'Updates events',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: EventsSchema.code
                }
            }
        }
    },
    {
        path: '/events/{code}',
        method: 'GET',
        handler: EventsHandlers.getOne,
        config: {
            description: 'Gets a specific events',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(EventsSchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: EventsSchema.code
                }
            }
        }
    }
];

