var hapi = require('hapi');
var Good = require('good');

var server = new hapi.Server();

server.connection({port: 3000});

server.route({
    method: 'GET',
    path: '/{yourname*}',
    handler: function (req, reply) {
        reply('Hello this is someone called ' + req.params.yourname + '!')
    }
});

server.register([{
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
], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

module.exports = server;