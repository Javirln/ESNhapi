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
    const Schema = Joigoose.convert(require('./section.joi').base);

    // Extend the schema
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

/**
 * Creates a section field with validation
 * that the section previously exists
 */
exports.sectionField = {
    type: String,
    ref: 'Section',
    index: true,
    validate: {
        validator: (value, done) => {

            const Section = require('./section.mongoose').Model;
            Section.find({ code: value })
                .then((result) => {

                    if (result.length === 1) {
                        done(true);
                    }
                    else {
                        return Promise.reject();
                    }
                })
                .catch(() => done(false));
        },
        message: '{VALUE} is not an existing Section code'
    }
};

