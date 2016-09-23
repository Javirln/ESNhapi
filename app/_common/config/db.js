'use strict';

const Mongoose = require('mongoose');
const mongoDB = () => {

    /* istanbul ignore else  */
    if (process.env.NODE_ENV === 'test') {
        return 'esnhapi-test';
    }
    /* istanbul ignore next */
    return 'esnhapi';
};

const mongoURL = `mongodb://mongo:27017/${mongoDB()}`;

Mongoose.connect(mongoURL);
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Connection with database succeeded.'));

exports.Mongoose = Mongoose;
exports.db = db;
