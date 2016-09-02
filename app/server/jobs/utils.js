'use strict';

const Ping = require('ping');
const DNS = require('dns');
const URL = require('url');

exports.schedule = (server) => {

    server.log('info', 'Checking sites');

    const sectionCollection = server.mongo.db.collection('sections');
    const sections = sectionCollection.find({});
    const updateSection = sectionCollection;


    sections.forEach((section) => {

        const urlObject = URL.parse(section.url);
        const interna = [];

        DNS.lookup(urlObject.host, function onLookup(err, address){
            Ping.sys.probe(address, function(isAlive){
                if (isAlive){
                    updateSection.updateOne({
                        _id: section._id
                    },{
                        $set: { alive: true }
                    });
                    interna.push(section);
                } else {
                    updateSection.updateOne({
                        _id: section._id
                    },{
                        $set: { alive: false }
                    });
                }
            });
        });
    },
        // Callback forEach()
        () => {
            server.log('info', 'Sites checked');
        });
};
