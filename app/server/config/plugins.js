'use strict';


exports.registerRouter = {
    register: require('hapi-router'),
    options: {
        routes: 'app/server/modules/**/routes.js' // uses glob to include files and starts where the process is started
    }
};

