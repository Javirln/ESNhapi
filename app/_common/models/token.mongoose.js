'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    access_rights: {
        type: String,
        unique: true
    },
    created_at: Date,
    updated_at: Date
});

// on every save, add the date
tokenSchema.pre('save', function(next) {
    // get the current date
    const currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }

    next();
});

const Token = Mongoose.model('Token', tokenSchema);

module.exports = Token;
