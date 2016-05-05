'use strict';

module.exports = [
    {
        path: '/content',
        method: 'GET',
        handler: (req, reply) => {

            reply('Returns content depending on the parameters given in the POST object');
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

