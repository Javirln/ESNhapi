'use strict';

const Joi = require('joi');
const Boom = require('boom');
const PartnerModel = require('./model');

module.exports = [
    {
        path: '/partners',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            reply(db
                .collection('partners')
                .find({})
                .sort({ _id: 1 })
                .toArray()).code(200);
        },
        config: {
            response: { schema: Joi.array().items(PartnerModel).label('Partners') },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'POST',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('partners')
                .insertOne({
                    _id: req.payload._id,
                    name: req.payload.title,
                    content: req.payload.content,
                    moreInformation: req.payload.moreInformation,
                    lastUpdate: Date.now()
                })
                .then(
                    (result) => {
                        console.log(result);
                        reply('Partner successfully created').code(201);
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
            description: 'Creates a partner',
            validate : {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/).required().example('AA-AAAA-AAA-partners-1234')
                        .description('Code of the partner'),

                    name: Joi.string().required().example('Awesome partner name')
                        .description('Name of the partner'),

                    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                        .description('Partner\'s description'),

                    moreInformation: Joi.array().items(Joi.string().example('Bar\'s website'))
                        .description('Links to more information')
                }).required().label('Partner')
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given payload is malformed, it must follow the given model' },
                        '404': { 'description': 'The partner with the given code does not exist' },
                        '409': { 'description': 'There is already a partner with that index' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners/{id}',
        method: 'DELETE',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('partners')
                .deleteOne({ _id: req.params.id })
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The partner with code ' + req.params._id + ' does not exist').code(404); // If no items deleted, return a 404
                        }
                        reply('Partner successfully removed').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Deletes a partner',
            validate: {
                params: {
                    id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/).required().example('AA-AAAA-AAA-partners-1234')
                        .description('Code of the partner')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-partner-1234' },
                        '404': { 'description': 'The partner with the given code does not exist' }
                    }
                }
            },
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners',
        method: 'PUT',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('partners')
                .replaceOne(
                    { _id: req.payload._id },
                {
                    title: req.payload.title,
                    content: req.payload.content,
                    moreInformation: req.payload.moreInformation,
                    lastUpdate: Date.now()
                }
                )
                .then(
                    (result) => {

                        if (result.result.n === 0) {
                            reply('The partner with code ' + req.payload._id + ' does not exist').code(404);
                        }
                        reply('Partner successfully updated').code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg)));
        },
        config: {
            description: 'Updates the content of a partner',
            notes: 'All values must be filled although they are not to be changed',
            validate: {
                payload: Joi.object({
                    _id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/).required().example('AA-AAAA-AAA-partners-1234')
                        .description('Code of the partner'),

                    name: Joi.string().required().example('Awesome partner name')
                        .description('Name of the partner'),

                    content: Joi.any().example('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
                        .description('Partner\'s description'),

                    moreInformation: Joi.array().items(Joi.string().example('Bar\'s website'))
                        .description('Links to more information')
                }).required().label('Partner')
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
        path: '/partners',
        method: 'PATCH',
        handler: (req, reply) => {

            reply('Update partially a partner');
        },
        config: {
            tags: ['api', 'swagger']
        }
    },
    {
        path: '/partners/{id}',
        method: 'GET',
        handler: (req, reply) => {

            const db = req.server.mongo.db;

            db.collection('partners')
                .findOne({ _id: req.params.id })
                .then(
                    (result) => {
                        if (result === null){
                            reply('The partner with the given code ' + req.params._id + ' does not exit').code(404);
                        }
                        reply(result).code(200);
                    },
                    (err) => reply(Boom.internal('Internal MongoDB error', err.errmsg))
                );
        },
        config: {
            description: 'Gets all the information of a partner',
            validate:{
                params: {
                    id: Joi.string().regex(/^[A-Z]{2}-[A-Z]{2,4}-[A-Z0-9]{3,4}-partners-[0-9]+$/).required().example('AA-AAAA-AAA-partners-1234')
                        .description('Code of the partner to fetch')
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': { 'description': 'The given code is malformed, it must follow the pattern AA-AAAA-AAA-partners-1234' },
                        '404': { 'description': 'The partner with the given code does not exist' }
                    }
                }
            },
            response: { schema: PartnerModel },
            tags: ['api', 'swagger']
        }
    }
];

