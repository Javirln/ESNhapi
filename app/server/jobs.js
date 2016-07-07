'use strict';

const FetchCountries = require('./jobs/fetchCountries');
const Schedule = require('node-schedule');

const ScheduleJobs = (server) => {

    server.log('info', 'Starting scheduling of jobs');
    Schedule.scheduleJob(
        '0 0 * * *',
        () => {

            return FetchCountries.schedule(server);
        });

};

module.exports = ScheduleJobs;
