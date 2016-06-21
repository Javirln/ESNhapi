'use strict';

const Blipp = require('blipp');
const HapiRouter = require('hapi-router');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const MongoDB = require('hapi-mongodb');

exports.registerGood = {
    register: Good,
    options: {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
};

exports.registerRouter = {
    register: HapiRouter,
    options: {
        routes: 'server/modules/**/routes.js' // uses glob to include files and starts where the process is started
    }
};

exports.registerBlipp = {
    register: Blipp,
    options: {}
};

exports.registerSwagger = {
    register: HapiSwagger
};

exports.registerMongoDB = {
    register: MongoDB,
    options: {
        url: 'mongodb://mongo:27017/test',
        settings: {
            db: {
                native_parser: false
            }
        }
    }
};

