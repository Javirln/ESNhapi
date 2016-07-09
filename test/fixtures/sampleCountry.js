'use strict';

exports.get = {
    method: 'GET',
    url: '/countries'
};

exports.getSpecific = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country._id
    }
};

exports.A = {
    _id: 'AA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere'
};

exports.create = (country) => {
    return {
        method: 'POST',
        url: '/countries',
        payload: country
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
