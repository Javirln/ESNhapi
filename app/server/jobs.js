'use strict';

const FetchCountries = require('./jobs/fetchCountries');
const FetchSections = require('./jobs/fetchSections');
const FetchCities = require('./jobs/fetchCities');
const FetchNews = require('./jobs/fetchNews');
const FetchEvents = require('./jobs/fetchEvents');
const HeartBeat = require('./jobs/utils');

const Schedule = require('node-schedule');


const ScheduleJobs = (server) => {

    server.log('info', 'Executing Scheduled Jobs at start');

    /*
     Promise.all([FetchCountries.schedule(server), FetchCities.schedule(server), FetchSections.schedule(server), HeartBeat.schedule(server)])
     .then(() => {
     FetchNews.schedule(server);
     FetchEvents.schedule(server);
     });
     */


    FetchCountries.schedule(server)
        .then(() => FetchCities.schedule(server))
        .then(() => FetchSections.schedule(server))
        .then(() => HeartBeat.schedule(server))
        .then(() => FetchNews.schedule(server))
        .then(() => FetchEvents.schedule(server))
        .catch((err) => server.log('error', 'An error occurred while executing cron' + err));


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
                .then(() => HeartBeat.schedule(server))
                .then(() => FetchNews.schedule(server))
                .catch((err) => server.log('error', 'An error occurred while executing cron' + err));

        });
};

module.exports = ScheduleJobs;
