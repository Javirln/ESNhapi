'use strict';

exports.get = {
    method: 'GET',
    url: '/sections'
};

exports.getSpecific = (section) => {

    return {
        method: 'GET',
        url: '/sections/' + section.code
    }
};

exports.A = {
    code: 'AA-AAAA-AAAA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere',
    country: 'AA',
    address: "Street 1",
    city: "AA-AAAA"
};

exports.B = {
    code: 'AA-AABB-AABB',
    url: 'http://bomewhere.com',
    name: 'ESN Bomewhere',
    country: 'AA',
    address: "Street 2",
    city: "AA-AABB"
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
