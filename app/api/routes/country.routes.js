'use strict';

const CountryHandlers = require('../handlers/country.handlers');
const CountrySchema = require('../../_common/models/country.joi.js');
const NewsSchema = require('../../_common/models/news.joi.js');
const EventSchema = require('../../_common/models/event.joi.js');
const PartnerSchema = require('../../_common/models/partner.joi.js');
const SectionSchema = require('../../_common/models/section.joi.js');
const CitySchema = require('../../_common/models/city.joi.js');
const Errors = require('../../_common/models/errors').errors;
const Error200 = require('../../_common/models/errors').generate200;
const SimpleTokenAuth = require('../config/auth/auth-simple-token').schema;
const Joi = require('joi');

module.exports = [
    {
        path: '/countries',
        method: 'GET',
        handler: CountryHandlers.getAll,
        config: {
            auth: 'simple',
            description: 'Gets all ESN countries',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CountrySchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                headers: SimpleTokenAuth
            }
        }
    },
    {
        path: '/countries',
        method: 'POST',
        handler: CountryHandlers.create,
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
                payload: CountrySchema.base
                    .requiredKeys('code', 'name')
                    .optionalKeys('url')
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'DELETE',
        handler: CountryHandlers.delete,
        config: {
            description: 'Deletes an ESN country',
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
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'PUT',
        handler: CountryHandlers.replace,
        config: {
            description: 'Replaces an ESN country',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'PATCH',
        handler: CountryHandlers.update,
        config: {
            description: 'Updates an ESN country',
            tags: ['api', 'swagger'],
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}',
        method: 'GET',
        handler: CountryHandlers.getOne,
        config: {
            description: 'Gets information from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(CountrySchema.base, false),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}/sections',
        method: 'GET',
        handler: CountryHandlers.getSections,
        config: {
            description: 'Gets the sections belonging to a specific ESN country',
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
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}/cities',
        method: 'GET',
        handler: CountryHandlers.getCities,
        config: {
            description: 'Gets the cities belonging to a specific ESN country',
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
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}/news',
        method: 'GET',
        handler: CountryHandlers.getNews,
        config: {
            description: 'Gets the news from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(NewsSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}/events',
        method: 'GET',
        handler: CountryHandlers.getEvents,
        config: {
            description: 'Gets the events from a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(EventSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    },
    {
        path: '/countries/{code}/partners',
        method: 'GET',
        handler: CountryHandlers.getPartners,
        config: {
            description: 'Gets the partners found in a specific ESN country',
            tags: ['api', 'swagger'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': Error200(PartnerSchema.base, true),
                        '500': Errors.HTTP500
                    }
                }
            },
            validate: {
                params: {
                    code: CountrySchema.code
                }
            }
        }
    }
];

