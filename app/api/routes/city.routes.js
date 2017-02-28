'use strict';

const CityHandlers = require('../handlers/city.handlers');
const CitySchema = require('../../_common/models/city.joi.js');
const Errors = require('../../_common/models/errors').errors;
const Error200 = require('../../_common/models/errors').generate200;

module.exports = [
    {
        path: '/cities',
        method: 'GET',
        handler: CityHandlers.getAll,
        config: {
            description: 'Gets all ESN cities',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            }
        }
    },
    {
        path: '/cities',
        method: 'POST',
        handler: CityHandlers.create,
        config: {
            description: 'Creates a new ESN city',
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
                payload: CitySchema.base
                    .requiredKeys('code', 'name')
                    .optionalKeys('otherNames')
            }
        }
    },
    {
        path: '/cities/{code}',
        method: 'DELETE',
        handler: CityHandlers.delete,
        config: {
            description: 'Deletes an ESN city',
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
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}',
        method: 'PUT',
        handler: CityHandlers.replace,
        config: {
            description: 'Replaces an ESN city',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}',
        method: 'PATCH',
        handler: CityHandlers.update,
        config: {
            description: 'Updates an ESN city',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}',
        method: 'GET',
        handler: CityHandlers.getOne,
        config: {
            description: 'Gets information from a specific ESN city',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}/sections',
        method: 'GET',
        handler: CityHandlers.getSections,
        config: {
            description: 'Gets the sections belonging to a specific ESN city',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}/news',
        method: 'GET',
        handler: CityHandlers.getNews,
        config: {
            description: 'Gets the news from a specific ESN city',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}/events',
        method: 'GET',
        handler: CityHandlers.getEvents,
        config: {
            description: 'Gets the events from a specific ESN city',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    },
    {
        path: '/cities/{code}/partners',
        method: 'GET',
        handler: CityHandlers.getPartners,
        config: {
            description: 'Gets the partners found in a specific ESN city',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CitySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CitySchema.code
                }
            }
        }
    }
];

