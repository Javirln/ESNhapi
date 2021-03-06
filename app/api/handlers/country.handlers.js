'use strict';

const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

const Country = require('../../_common/models/country.mongoose.js').Model;
const City = require('../../_common/models/city.mongoose.js').Model;
const Section = require('../../_common/models/section.mongoose.js').Model;
const New = require('../../_common/models/news.mongoose.js').Model;
const Partner = require('../../_common/models/partner.mongoose.js').Model;
const Event = require('../../_common/models/event.mongoose.js').Model;

exports.getAll = (req, reply) => {

    Country.find({})
        .then((result) => reply(result).code(200))
        .catch((error) => reply(Boom.internal(error.errmsg)));
};

exports.create = (req, reply) => {

    new Country(req.payload).save()
        .then((result) => reply().code(201).location('/countries/' + req.payload.code))
        .catch((error) => {

            if (error.code === 11000) {
                reply(Boom.conflict(error.errmsg, error.data));
            }
            else {
                reply(Boom.internal(error.errmsg));
            }
        });
};

exports.delete = (req, reply) => {

    Country.findOne({ code: req.params.code })
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

    Country.findOne({ code: req.params.code })
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result);

        })
        .catch((error) => reply(error));

};

exports.getSections = (req, reply) => {

    Country.findOne({ code: req.params.code })
        .sort([['code', 'ascending']])
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Section
                .find({ country: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result).code(200);
        })
        .catch((error) => reply(error));

};

exports.getCities = (req, reply) => {

    Country.findOne({ code: req.params.code })
        .sort([['code', 'ascending']])
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            City
                .find({ country: req.params.code })
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

    Country.findOne({ code: req.params.code })
        .sort([['code', 'ascending']])
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            New
                .find({ country: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            reply(result).code(200);
        })
        .catch((error) => reply(error));
};

exports.getEvents = (req, reply) => {

    Country.findOne({ code: req.params.code })
        .sort([['code', 'ascending']])
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Event
                .find({ country: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            reply(result).code(200);
        })
        .catch((error) => reply(error));
};

exports.getPartners = (req, reply) => {

    Country.findOne({ code: req.params.code })
        .sort([['code', 'ascending']])
        .catch((error) => Boom.internal(error.errmsg))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
        })
        .then(() =>

            Partner
                .find({ country: req.params.code })
                .catch((error) => Boom.internal(error.errmsg)))
        .then((result) => {

            reply(result).code(200);
        })
        .catch((error) => reply(error));
};
