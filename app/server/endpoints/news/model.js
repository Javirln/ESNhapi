'use strict';

const Joi = require('joi');

module.exports = Joi.object({
    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
        .description('Code of the new'),

    title: Joi.string().required().example('Awesome title')
        .description('Title of the new'),

    createdOnSatellite: Joi.date().example('2016-06-05T12:32:35+02:00')
        .description('Date when the new was created on Satellite'),

    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        .description('The body of the new'),

    lastUpdate: Joi.number().example('1468776265810.0')
        .description('The timestamp about when it was fetched')

}).label('New');
