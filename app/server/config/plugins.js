'use strict';

const mongoDB = () => {

    /* istanbul ignore else  */
    if (process.env.NODE_ENV === 'test') {
        return 'esnhapi-test';
    }
    /* istanbul ignore next */
    return 'esnhapi';
};

const mongoURL = `mongodb://mongo:27017/${mongoDB()}`;

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
                },{
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
            routes: 'app/server/endpoints/**/routes.js' // uses glob to include files and starts where the process is started
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
            url: mongoURL,
            decorate: true,
            settings: {
                promiseLibrary: 'bluebird'
            }
        }
    }
};

