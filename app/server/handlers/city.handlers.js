'use strict';

const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

const City = require('../models/city.mongoose.js').Model;
const Section = require('../models/section.mongoose.js').Model;
const New = require('../models/news.mongoose.js').Model;
const Partner = require('../models/partner.mongoose.js').Model;
const Event = require('../models/event.mongoose.js').Model;

exports.getAll = (req, reply) => {

    City.find({})
        .exec()
        .then((result) => reply(result).code(200))
        .catch((error) => reply(Boom.internal(error.errmsg)));
};

exports.create = (req, reply) => {

    new City(req.payload).save()
        .then((result) => reply().code(201).location('/cities/' + req.payload.code))
        .catch((error) => {

            if (error.code === 11000) {
                reply(Boom.conflict(error.errmsg, error.data));
            }
            else if (error.errors.country) {
                reply(Boom.badRequest(error.errors.country.message));
            }
            else {
                reply(Boom.internal(error.errmsg));
            }
        });
};

exports.delete = (req, reply) => {

    City.findOne({ code: req.params.code })
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (result) {
                return result.remove();
            }
            return Promise.reject(Boom.notFound());
        })
        .then((result) => reply().code(204))
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

    City.findOne({ code: req.params.code })
        .sort([['_id', 'ascending']])
        .exec()
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (result === null) {
                return Promise.reject(Boom.notFound());
            }
            reply(result);

        })
        .catch((error) => reply(error));

};

exports.getSections = (req, reply) => {

    City.find({ code: req.params.code })
        .exec()
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Section
                .find({ city: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result).code(200);
        })
        .catch((error) => reply(error));

};

exports.getNews = (req, reply) => {

    City.find({ code: req.params.code })
        .exec()
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            New
                .find({ city: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result).code(200);
        })
        .catch((error) => reply(error));
};

exports.getEvents = (req, reply) => {

    City.find({ code: req.params.code })
        .exec()
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Event
                .find({ city: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result).code(200);
        })
        .catch((error) => reply(error));
};

exports.getPartners = (req, reply) => {

    City.find({ code: req.params.code })
        .exec()
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Partner
                .find({ city: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result).code(200);
        })
        .catch((error) => reply(error));
};
