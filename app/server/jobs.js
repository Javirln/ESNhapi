'use strict';

const FetchCountries = require('./jobs/fetchCountries');
const FetchSections = require('./jobs/fetchSections');
const FetchCities = require('./jobs/fetchCities');
const Schedule = require('node-schedule');

const ScheduleJobs = (server) => {

    server.log('info', 'Executing Scheduled Jobs at start');

    FetchCountries.schedule(server);
    FetchSections.schedule(server);
    FetchCities.schedule(server);

    // ==================
    // = CRON SCHEDULES =
    // ==================
    server.log('info', 'Scheduling of jobs');
    Schedule.scheduleJob(
        '0 0 * * *',
        () => {

            return FetchCountries.schedule(server)
                .then(() => FetchCities.schedule(server))
                .then(() => FetchSections.schedule(server))
                .catch((err) => server.log('error', 'An error occurred while executing cron' + err));

        });
};

module.exports = ScheduleJobs;
