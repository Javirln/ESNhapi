'use strict';

const Joi = require('joi');

exports.setup = (server) => {


    server.auth.strategy('simple', 'bearer-access-token', {
        validateFunc: (token, callback) => {

            // Use a real strategy here,
            // comparing with a token from your database for example
            if (token === '1234') {
                return callback(null, true, { token: token }, { artifact1: 'an artifact' });
            }

            return callback(null, false, { token: token }, { artifact1: 'an artifact' });
        }
    });
};

exports.schema = Joi.object({ 'authorization': Joi.string().required() }).unknown();
