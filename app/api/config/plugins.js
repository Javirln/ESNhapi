'use strict';

exports.registerGood = {
    plugin: {
        register: 'good',
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
                }, 'stdout'],
                file: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*', ops: '*', error: '*', request: '*' }]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson',
                    args: [
                        null,
                        { separator: '\n' }
                    ]
                }, {
                    module: 'good-file',
                    args: ['./app/logs/general.log']
                }]
            }
        }
    }
};

exports.registerRouter = {
    plugin: {
        register: 'hapi-router',
        options: {
            routes: 'app/api/routes/*.routes.js' // uses glob to include files and starts where the process is started
        }
    }
};

exports.registerBlipp = {
    plugin: {
        register: 'blipp',
        options: {}
    }
};

exports.registerInert = {
    plugin: {
        register: 'inert'
    }
};

exports.registerVision = {
    plugin: {
        register: 'vision'
    }
};

exports.registerSwagger = {
    plugin: {
        register: 'hapi-swagger'
    }
};
