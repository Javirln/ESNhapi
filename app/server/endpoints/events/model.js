'use strict';

const Joi = require('joi');

module.exports = Joi.object({
    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-events-[0-9]+$/).required().example('AA-AAAA-AAA-events-1234')
        .description('Code of the event'),

    title: Joi.string().required().example('Awesome title')
        .description('Title of the event'),

    dateStarts: Joi.date().required().example('2016-06-05T12:32:35+02:00')
        .description('The date when the event starts'),

    dateEnds: Joi.date().example('2016-06-10T12:00:00+02:00')
        .description('The date when the event ends'),

    place: Joi.any().example('Antartica')
        .description('Where the event is taking place'),

    price: Joi.any().example('19,95€')
        .description('Price of the Event'),


    eventType: Joi.array().items(Joi.string().example('Cultural'))
        .description('Event type'),

    meetingPoint: Joi.any().example('Midtown')
        .description('Where is the meeting point'),

    moreInformation: Joi.array().items(Joi.string().example('Bar\'s website'))
        .description('Links to more information'),

    included: Joi.array().items(Joi.string().example('Transport'))
        .description('What\'s included in the price'),

    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        .description('The description of the event'),
    // Since although filling all fields on an Event on Satellite, we still don't know the types, so Joi.any() will do the trick for the moment
    address: Joi.any({
        country: Joi.any(),
        administrative_area: Joi.any(),
        sub_administrative_area: Joi.any(),
        locality: Joi.any(),
        dependent_locality: Joi.any(),
        postal_code: Joi.any(),
        thoroughfare: Joi.any(),
        premise: Joi.any(),
        sub_premise: Joi.any(),
        organisation_name: Joi.any(),
        name_line: Joi.any(),
        first_name: Joi.any(),
        last_name: Joi.any(),
        data: Joi.any()
    }),

    location: Joi.any().example('POINT (-0.1214235 40.6650743)'),

    lastUpdate: Joi.number().example('1468776265810.0')
        .description('The timestamp about when it was fetched')
}).label('Event');
