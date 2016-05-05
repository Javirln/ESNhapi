var Confidence, criteria, rtg_url, store;

Confidence = require('confidence');

if (process.env.REDISTOGO_URL) {
    rtg_url = require("url").parse(process.env.REDISTOGO_URL);
}

store = new Confidence.Store({
    cache: {
        $filter: 'env',
        production: {
            engine: 'catbox-redis',
            host: rtg_url != null ? rtg_url.hostname : void 0,
            port: rtg_url != null ? rtg_url.port : void 0,
            password: rtg_url != null ? rtg_url.auth.split(":")[1] : void 0
        },
        $default: 'catbox-redis'
    },
    database: {
        $filter: 'env',
        production: 'foo_production',
        staging: 'foo_staging',
        development: 'foo_development'
    }
});

criteria = {
    env: process.env.ENVIRONMENT
};

exports.get = function(key) {
    return store.get(key, criteria);
};