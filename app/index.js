var hapi = require('hapi');

var server = new hapi.Server();

server.connection({port: 3000});

server.route({
    method: 'GET',
    path: '/{yourname*}',
    handler: function (req, reply) {
        reply('Hello this is someone called ' + req.params.yourname + '!')
    }
});

server.register(
    require('./server/config/good').register,
    function (err) {
        if (err) {
            throw err; // something bad happened loading Good
        }

        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });

module.exports = server;