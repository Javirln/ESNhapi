'use strict';

const Blipp = require('blipp');
const HapiRouter = require('hapi-router');
const Good = require('good');

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
        routes: 'app/server/modules/**/routes.js' // uses glob to include files and starts where the process is started
    }
};

exports.registerBlipp = { register: Blipp, options: {} };

