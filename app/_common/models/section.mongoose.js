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
    const Schema = Joigoose.convert(require('./section.joi.js').base);

    // Extend the schema
    Schema.code.unique = true;
    Schema.country = require('./country.mongoose.js').countryField;
    Schema.city = require('./city.mongoose.js').cityField;


// Create model
    const Model = Mongoose.model('Section', new Mongoose.Schema(Schema));
    Model.schema.plugin(MongooseHidden);

// Create indexes
    Model.schema.index({ code: 1, type: 1 });


// Cascade delete children when removing
    Model.schema.pre('remove', function (next) {
        // All this should be wrapped in something like Promise.all()
        const New = require('./news.mongoose.js').Model;

        New.find({ section: this.code })
            .then((result) => {

                if (result !== 0){
                    Promise.map(result, (singleNew) => New.remove( { code: singleNew.code } ))
                        .catch((err) => console.log(err))
                    .then(() => next());
                }
            })
            .catch((err) => console.log(err));

        const Partner = require('./partner.mongoose.js').Model;

        Partner.find({ section: this.code })
            .then((result) => {

                if (result !== 0){
                    Promise.map(result, (partner) => Partner.remove( { code: partner.code } ))
                        .catch((err) => console.log(err))
                        .then(() => next());
                }
            })
            .catch((err) => console.log(err));

        const Event = require('./event.mongoose.js').Model;

        Event.find({ section: this.code })
            .then((result) => {

                if (result !== 0){
                    Promise.map(result, (event) => Event.remove( { code: event.code } ))
                        .catch((err) => console.log(err))
                        .then(() => next());
                }
            })
            .catch((err) => console.log(err));
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

            const Section = require('./section.mongoose.js').Model;
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

