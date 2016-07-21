'use strict';

const Joi = require('joi');

module.exports = Joi.object({
    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/).required().example('AA-AAAA-AAA-partners-1234')
        .description('Code of the new'),

    name: Joi.string().required().example('Awesome partner name')
        .description('Name of the partner'),

    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        .description('Partner\'s description'),

    moreInformation: Joi.any().example('Bar\'s website')
        .description('Links to more information'),

    lastUpdate: Joi.number().example('1468776265810.0')
        .description('The timestamp about when it was fetched')

}).label('Partner');
