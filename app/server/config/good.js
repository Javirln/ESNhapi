'use strict';

var Good = require('good');

exports.register = [{
    register: Good,
    options: {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{log: '*', response: '*'}]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, {
    register: require('hapi-router'),
    options: {
        routes: 'server/modules/**/routes.js' // uses glob to include files
    }
}
];
