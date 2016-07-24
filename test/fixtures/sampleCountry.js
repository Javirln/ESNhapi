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

exports.getSections = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country._id + '/sections'
    }
};

exports.getCities = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country._id + '/cities'
    }
};

exports.getNews = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country._id + '/news'
    }
};

exports.A = {
    _id: 'AA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere'
};

exports.Z = {
    _id: 'ZZ',
    url: 'http://zigzag.com',
    name: 'ESN ZigZag'
};

exports.create = (country) => {
    return {
        method: 'POST',
        url: '/countries',
        payload: country
    }
};

exports.delete = (country) => {
    return {
        method: 'DELETE',
        url: '/countries/' + country._id
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
