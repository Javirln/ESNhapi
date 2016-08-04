'use strict';

const Promise = require('bluebird');
const Boom = require('boom');

const Section = require('../models/section.mongoose.js').Model;

exports.getAll = (req, reply) => {

    Section.find({})
        .sort([['code', 'ascending']])
        .then((result) => reply(result).code(200))
        .catch((error) => reply(Boom.internal(error.errmsg)));
};

exports.create = (req, reply) => {

    new Section(req.payload).save()
        .then((result) => reply().code(201).location('/sections/' + req.payload.code))
        .catch((error) => {

            if (error.code === 11000) {
                reply(Boom.conflict(error.errmsg, error.data));
            }
            else if (error.errors.country) {
                reply(Boom.badRequest(error.errors.country.message));
            }
            else if (error.errors.city) {
                reply(Boom.badRequest(error.errors.city.message));
            }
            else {
                reply(Boom.internal(error.errmsg));
            }
        });
};

exports.delete = (req, reply) => {

    Section.findOne({ code: req.params.code })
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (result === null) {
                return Promise.reject(Boom.notFound());
            }
            return result.remove();

        })
        .then(
            (result) => reply().code(204)
        )
        .catch((error) => reply(error));

};

exports.replace = (req, reply) => {

    // TODO Needs to be implemented
    reply(Boom.notImplemented());
};

exports.update = (req, reply) => {

    // TODO Needs to be implemented
    reply(Boom.notImplemented());
};

exports.getOne = (req, reply) => {

    Section.findOne({ code: req.params.code })
        .sort([['_id', 'ascending']])
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (result === null) {
                return Promise.reject(Boom.notFound());
            }
            reply(result.lean());

        })
        .catch((error) => reply(error));

};

exports.getNews = (req, reply) => {

    // TODO Needs to be implemented
    reply(Boom.notImplemented());
};

exports.getEvents = (req, reply) => {

    // TODO Needs to be implemented
    reply(Boom.notImplemented());
};

exports.getPartners = (req, reply) => {

    // TODO Needs to be implemented
    reply(Boom.notImplemented());
};
