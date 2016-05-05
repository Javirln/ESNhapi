'use strict';

module.exports = [
    {
        path: '/fetchMe',
        method: 'GET',
        handler: (req, reply) => {

            reply('Triggers an update to fetch from an specific origin');
        },
        config: {
            tags: ['api', 'swagger']
        }
    }
];

