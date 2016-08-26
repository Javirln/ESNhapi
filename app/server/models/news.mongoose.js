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
    const Schema = Joigoose.convert(require('./news.joi').base);

    // Extend the schema
    Schema.code.unique = true;
    Schema.country = require('./country.mongoose').countryField;
    Schema.city = require('./city.mongoose').cityField;
    Schema.section = require('./section.mongoose').sectionField;


    // Create model
    const Model = Mongoose.model('News', Schema);
    Model.schema.plugin(MongooseHidden);

    // Create indexes
    Model.schema.index({ code: 1, type: 1 });

    Model.schema.pre('save', function (next){
        this.lastUpdate = Date.now();
        next();
    });

    return Model;
};

exports.Model = createModel();
