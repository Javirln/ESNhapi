'use strict';

exports.get = {
    method: 'GET',
    url: '/sections'
};

exports.getSpecific = (section) => {

    return {
        method: 'GET',
        url: '/sections/' + section._id
    }
};

exports.A = {
    _id: 'AA-AAAA-AAAA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere',
    country: 'AA'
};

exports.B = {
    _id: 'AA-AABB-AABB',
    url: 'http://bomewhere.com',
    name: 'ESN Bomewhere',
    country: 'AA'
};

exports.create = (section) => {
    return {
        method: 'POST',
        url: '/sections',
        payload: section
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
