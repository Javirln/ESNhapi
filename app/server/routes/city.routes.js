'use strict';

const CityHanlders = require('../handlers/city.handlers');
const CitySchema = require('../models/city.joi.js');
const Errors = require('../models/errors').errors;
const Error200 = require('../models/errors').generate200;

module.exports = [
    {
        path: '/cities',
        method: 'GET',
        handler: CityHanlders.getAll,
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
        handler: CityHanlders.create,
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
        handler: CityHanlders.delete,
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
        handler: CityHanlders.replace,
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
        handler: CityHanlders.update,
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
        handler: CityHanlders.getOne,
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
        handler: CityHanlders.getSections,
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
        handler: CityHanlders.getNews,
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
        handler: CityHanlders.getEvents,
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
        handler: CityHanlders.getPartners,
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

