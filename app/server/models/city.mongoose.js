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
    const Schema = Joigoose.convert(require('./city.joi').base);

    // Extend the schema
    Schema.code.unique = true;
    Schema.country = require('./country.mongoose').countryField;

    // Create model
    const Model = Mongoose.model('City', new Mongoose.Schema(Schema));
    Model.schema.plugin(MongooseHidden);

    // Create indexes
    Model.schema.index({ code: 1, type: 1 });


    // Cascade delete children when removing
    Model.schema.pre('remove', function (next) {

        const Section = require('./section.mongoose').Model;

        Section.find({ city: this.code })
            .then((result) => {

                if (result.length !== 0) {
                    Promise.map(result, (section) => section.remove())
                        .then(() => next());
                }
                next();
            });
    });

    return Model;
};

exports.Model = createModel();


/**
 * Creates a country field with validation
 * that the country previously exists
 */
exports.cityField = {
    type: String,
    ref: 'City',
    index: true,
    validate: {
        validator: (value, done) => {

            const City = require('./city.mongoose').Model;
            City.find({ code: value })
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
        message: '{VALUE} is not an existing City code'
    }
};
