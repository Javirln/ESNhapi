'use strict';

exports.getAll = {
    method: 'GET',
    url: '/cities'
};

exports.get = (city) => {

    return {
        method: 'GET',
        url: '/cities/' + city.code
    }
};

exports.getCities = (city) => {

    return {
        method: 'GET',
        url: '/cities/' + city.code + '/sections'
    }
};

exports.A = {
    code: 'AA-AAA',
    country: 'AA',
    name: 'City AA',
    otherNames: [
        'City AAelse'
    ]
};

exports.B = {
    code: 'AA-AAB',
    country: 'AA',
    name: 'City AB',
    otherNames: [
        'City AAelse'
    ]
};

exports.Z = {
    code: 'ZZ-ZZZ',
    country: 'ZZ',
    name: 'City ZZ',
    otherNames: [
        'City ZZelse'
    ]
};

exports.create = (city) => {
    return {
        method: 'POST',
        url: '/cities',
        payload: city
    }
};

exports.delete = (city) => {
    return {
        method: 'DELETE',
        url: '/cities/' + city.code
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
