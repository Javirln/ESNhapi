'use strict';

const ping = require('ping');
const dns = require('dns');
const url = require('url');

exports.schedule = (server) => {

    server.log('info', 'Checking sites');

    const sectionCollection = server.mongo.db.collection('sections');
    const sections = sectionCollection.find({});
    const updateSection = sectionCollection;


    sections.forEach((section) => {

        const urlObject = url.parse(section.url);
        const interna = [];

        dns.lookup(urlObject.host, function onLookup(err, address){
            ping.sys.probe(address, function(isAlive){
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