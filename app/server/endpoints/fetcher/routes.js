'use strict';

const request = require('request');
const fs = require('fs');
const Joi = require('joi');

const base_dir = './app/server/images/';

module.exports = [
    {
        path: '/image',
        method: 'GET',
        handler: (req, reply) => {
            const download = function (uri, filename, callback) {
                request.head(uri, (err, res, body) => {
                    // We must control whether the header content-type is included or not,
                    // otherwise the file will not be saved correctly
                    request(uri).pipe(fs.createWriteStream(
                        base_dir + filename + '.' + res.headers['content-type'].split('/')[1]))
                        .on('close', callback);
                });
            };

            download(req.query.url, req.query.name, () => {
                reply('Image successfully downloaded').code(200);
            });
        },
        config: {
            validate: {
                query: {
                    url: Joi.string().required().description('Url to image'), // Validation for urls needs to be implemented
                    name: Joi.string().required().description('Name of the file') // Validation for urls needs to be implemented
                }
            },
            tags: ['api', 'swagger']
        }
    }
];

