'use strict';

const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');
const Joigoose = require('joigoose')(Mongoose);
const MongooseHidden = require('mongoose-hidden')();
const Schema = Joigoose.convert(require('./section.joi').base);

const createModel = () => {
// Extend Schema
    Schema.code.unique = true;
    Schema.country = require('./country.mongoose').countryField;
    Schema.city = require('./city.mongoose').cityField;


// Create model
    const Model = Mongoose.model('Section', Schema);
    Model.schema.plugin(MongooseHidden);

// Create indexes
    Model.schema.index({ code: 1, type: 1 });


// Cascade delete children when removing
    Model.schema.pre('remove', (next) => {
        // 'this' is the client being removed. Provide callbacks here if you want
        // to be notified of the calls' result.
        next();
    });

    return Model;
};

exports.Model = createModel();

