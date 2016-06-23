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
                }, 'stdout']
            }
        }
    }
};

exports.registerRouter = {
    plugin: {
        register: 'hapi-router',
        options: {
            routes: 'app/server/modules/**/routes.js' // uses glob to include files and starts where the process is started
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

exports.registerInjectThen = {
    plugin: {
        register: 'inject-then'
    }
};

exports.registerMongoDB = {
    plugin: {
        register: 'hapi-mongodb',
        options: {
            url: 'mongodb://mongo:27017/test',
            settings: {
                db: {
                    native_parser: false
                }
            }
        }
    }
};

