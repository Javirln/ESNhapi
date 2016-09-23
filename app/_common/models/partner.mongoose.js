'use strict';

const Mongoose = require('mongoose');
const Promise = require('bluebird');
Mongoose.Promise = Promise;
const Joigoose = require('joigoose')(Mongoose);
const MongooseHidden = require('mongoose-hidden')();

/**
 * Creates a Mongoose model
 */
const createModel = () => {

    // Convert it from Joi schema
    const Schema = Joigoose.convert(require('./partner.joi.js').base);

    // Extend the schema
    Schema.code.unique = true;
    Schema.country = require('./country.mongoose.js').countryField;
    Schema.city = require('./city.mongoose.js').cityField;
    Schema.section = require('./section.mongoose.js').sectionField;


    // Create model
    const Model = Mongoose.model('Partners', Schema);
    Model.schema.plugin(MongooseHidden);

    // Create indexes
    Model.schema.index({ code: 1, type: 1 });

    return Model;
};

exports.Model = createModel();

