'use strict';

const FetchCountries = require('./jobs/fetchCountries');
const FetchSections = require('./jobs/fetchSections');
const FetchCities = require('./jobs/fetchCities');
const FetchNews = require('./jobs/fetchNews');
const FetchEvents = require('./jobs/fetchEvents');
const FetchPartners = require('./jobs/fetchPartners');
const ValidSections = require('./jobs/validSections');
const Promise = require('bluebird');

const Schedule = require('node-schedule');

require('../_common/config/db');

// ==================
// = CRON SCHEDULES =
// ==================
console.log('[INFO] Scheduling of jobs');
Schedule.scheduleJob(
    '0 0 * * *',
    () => {

        return FetchCountries.schedule()
            .then(() => FetchCities.schedule())
            .then(() => FetchSections.schedule())
            .then(() => ValidSections())
            .then((validSections) =>

                FetchNews.schedule(validSections)
                    .then(() => FetchEvents.schedule(validSections))
                    .then(() => FetchPartners.schedule(validSections))
            )
            .catch((err) => console.log('[ERROR] An error occurred while executing cron' + err));

    });

console.log('[INFO] Executing Scheduled Jobs at start');
FetchCountries.schedule()
    .then(() => FetchCities.schedule())
    .then(() => FetchSections.schedule())
    .then(() => ValidSections())
    .then((validSections) =>

            FetchNews.schedule(validSections)
                .then(() => FetchEvents.schedule(validSections))
                .then(() => FetchPartners.schedule(validSections))
    )
    .catch((err) => console.log('[ERROR] An error occurred while executing startjob' + err));

