'use strict';

const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');
const Joigoose = require('joigoose')(Mongoose);
const MongooseHidden = require('mongoose-hidden')();

/**
 * Creates a Mongoose model
 */
const createModel = () => {

    // Convert it from Joi schema
    const Schema = Joigoose.convert(require('./country.joi').base);

    // Extend the schema
    Schema.code.unique = true;

    // Create model
    const Model = Mongoose.model('Country', new Mongoose.Schema(Schema));
    Model.schema.plugin(MongooseHidden);

    // Create indexes
    Model.schema.index({ code: 1, type: 1 });


    // Cascade delete children when removing
    Model.schema.pre('remove', function (next) {

        const Section = require('./section.mongoose');
        Section.remove({ country: this.code }).exec();
        next();
    });

    return Model;
};

exports.Model = createModel();


/**
 * Creates a country field with validation
 * that the country previously exists
 */
exports.countryField = {
    type: String,
    ref: 'Country',
    index: true,
    validate: {
        validator: (value, done) => {

            const Country = require('./country.mongoose');
            Country.find({ code: value })
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
        message: '{VALUE} is not an existing Country code'
    }
};



