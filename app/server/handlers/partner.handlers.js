'use strict';

const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

const Partner = require('../models/partner.mongoose.js').Model;

exports.getAll = (req, reply) => {

    Partner.find({})
        .sort([['code', 'ascending']])
        .then((result) => reply(result).code(200))
        .catch((error) => reply(Boom.internal(error.errmsg)));
};

exports.create = (req, reply) => {

    new Partner(req.payload).save()
        .then((result) => reply().code(201).location('/partners/' + req.payload.code))
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

    Partner.findOne({ code: req.params.code })
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

    Partner.findOne({ code: req.params.code })
        .catch((error) => Promise.reject(Boom.internal(error.errmsg)))
        .then((result) => {

            if (_.isEmpty(result)) {
                return Promise.reject(Boom.notFound());
            }
            reply(result);

        })
        .catch((error) => reply(error));

};
