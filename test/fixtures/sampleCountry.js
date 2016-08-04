'use strict';

exports.get = {
    method: 'GET',
    url: '/countries'
};

exports.getOne = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country.code
    }
};

exports.getSections = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country.code + '/sections'
    }
};

exports.getCities = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country.code + '/cities'
    }
};

exports.getNews = (country) => {

    return {
        method: 'GET',
        url: '/countries/' + country.code + '/news'
    }
};

exports.A = {
    code: 'AA',
    url: 'http://somewhere.com',
    name: 'ESN Somewhere'
};

exports.Z = {
    code: 'ZZ',
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
        url: '/countries/' + country.code
    }
};
