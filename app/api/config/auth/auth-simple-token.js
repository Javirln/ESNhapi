'use strict';

const Joi = require('joi');

const Token = require('../../../_common/models/token.mongoose');

exports.setup = (server) => {


    server.auth.strategy('simple', 'bearer-access-token', {
        validateFunc: function (token, callback) {

            Token.find({ token: token })
                .lean()
                .exec()
                .catch((error) => callback(error, false, { token: token }))
                .then((valid_token) => {

                    if (valid_token && valid_token.length === 1 && valid_token[0].token === token) {

                        if (this.method === 'get') {
                            return callback(null, true, { token: token });
                        }
                        else if (valid_token[0].access_rights === 'ADMIN' && this.method !== 'get') {
                            return callback(null, true, { token: token });
                        }

                        return callback(error, false, { token: token });
                    }
                });
        }
    });
};

exports.schema = Joi.object({ 'authorization': Joi.string().required() }).unknown();
