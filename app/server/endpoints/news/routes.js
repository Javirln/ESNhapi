'use strict';

const Joi = require('joi');
const Boom = require('boom');
const NewsModel = require('./model');

module.exports = [
    {
        path: '/news',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            reply(db
                .collection('news')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            description: 'Gets all news',
            //response: { schema: Joi.array().items(NewsModel).label('News') },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('news')
                .insertOne({
                    _id: req.payload._id,
                    title: req.payload.title,
                    content: req.payload.content,
                    lastUpdate: Date.now(),
                    country: req.payload.country,
                    section: req.payload.city,
                    city: req.payload.city
                })
                .then(
                    () => {
                        reply('New successfully created').code(201);
                    },
                    (err) => {

                        if (err) {
                            if (err.code === 11000) {
                                return reply(Boom.conflict('Duplicated index', err.errmsg));
                            }
                            return reply(Boom.internal('Internal MongoDB error', err.errmsg));
                        }
                    });
        },
        config: {
            description: 'Creates a new',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
                        .description('Code of the new'),
                    title: Joi.string().required().example('Awesome title')
                        .description('Title of the new'),
                    content: Joi.string().required().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                        .description('The body of the new'),
                    country: Joi.string().length(2).uppercase().example('AA')
                        .description('Code of the country').required(),
                    city: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}$/).example('AA-AAAA')
                        .description('Code of the city').required(),
                    section: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}$/).example('AA-AAAA-AAAA')
                        .description('Code of the section').required()
                }).required().label('New')
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The new with the given code does not exist' },
                        '409': { 'description': 'There is already a new with that index' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news/{_id}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('news')
                .deleteOne({ _id: req.params._id })
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The new with code ' + req.params._id + ' does not exist').code(404); // If no items deleted, return a 404
                        }
                        reply('New successfully removed').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Deletes a new',
            validate: {
                params: {
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
                        .description('Code of the new')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-news-1234' },
                        '404': { 'description': 'The new with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'PUT',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('news')
                .replaceOne(
                    { _id: req.payload._id },
                {
                    title: req.payload.title,
                    content: req.payload.content,
                    lastUpdate: Date.now()
                }
                )
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The new with code ' + req.payload._id + ' does not exist').code(404);
                        }
                        reply('New successfully updated').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Updates the content of a new',
            notes: 'All values must be filled although they are not to be changed',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
                        .description('Code of the new'),
                    title: Joi.string().required().example('Awesome title')
                        .description('Title of the new'),
                    content: Joi.string().required().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                        .description('The body of the new')
                }).required().label('New')
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must contains all the fields' },
                        '404': { 'description': 'The city with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/news',
        method: 'PATCH',
        handler: (req, reply) => {

        //    const db = req.server.mongo.db;
        //
        //    db.collection('news')
        //        .replaceOne(
        //            { _id: req.payload._id },
        //        {
        //            title: req.payload.title,
        //            content: req.payload.content,
        //            lastUpdate: Date.now()
        //        }
        //        )
        //        .then(
        //            (result) => {
        //
        //                if (result.result.n === 0) {
        //                    reply('The new with code ' + req.payload._id + ' does not exist').code(404);
        //                }
        //                reply('New successfully updated').code(200);
        //            },
        //            (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        //},
        //config: {
        //    description: 'Updates the partially the of a new',
        //    validate: {
        //        payload: Joi.object({
        //            _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
        //                .description('Code of the new'),
        //            title: Joi.string().example('Awesome title')
        //                .description('Title of the new'),
        //            content: Joi.string().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        //                .description('The body of the new')
        //        }).required().label('New')
        //    },
        //    plugins: {
        //        'hapi-swagger': {
        //            responses: {
        //                '400': { 'description': 'The given payload is malformed, it must contains all the fields' },
        //                '404': { 'description': 'The city with the given code does not exist' }
        //            }
        //        }
        //    },
        }
    },
    {
        path: '/news/{_id}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('news')
                .findOne({ _id: req.params._id })
                .then(
                    (result) => {
                        if (result === null){
                            reply('The new with the given code ' + req.params._id + ' does not exit').code(404);
                        }
                        reply(result).code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))
                );
        },
        config: {
            description: 'Gets all the information of a new',
            validate:{
                params: {
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-news-[0-9]+$/).required().example('AA-AAAA-AAA-news-1234')
                        .description('Code of the new to fetch')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-news-1234' },
                        '404': { 'description': 'The new with the given code does not exist' }
                    }
                }
            },
            //response: { schema: NewsModel },
            tags: ['api', 'swagger']
        }
    }
];

