'use strict';

const FetchCountries = require('./jobs/fetchCountries');
const Schedule = require('node-schedule');

const ScheduleJobs = (server) => {

    server.log('info', 'Executing Scheduled Jobs at start');

    FetchCountries.schedule(server);

    // ==================
    // = CRON SCHEDULES =
    // ==================
    server.log('info', 'Scheduling of jobs');
    Schedule.scheduleJob(
        '0 0 * * *',
        () => {

            return FetchCountries.schedule(server);
        });

};

module.exports = ScheduleJobs;
