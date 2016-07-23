'use strict';

exports.get = {
    method: 'GET',
    url: '/cities'
};

exports.getSpecific = (city) => {

    return {
        method: 'GET',
        url: '/cities/' + city._id
    }
};

exports.getCities = (city) => {

    return {
        method: 'GET',
        url: '/cities/' + city._id + '/sections'
    }
};

exports.A = {
    _id: 'AA-AAAA',
    country: 'AA',
    name: 'City AA',
    otherNames: [
        'City AAelse'
    ]
};

exports.B = {
    _id: 'AA-AABB',
    country: 'AA',
    name: 'City AB',
    otherNames: [
        'City AAelse'
    ]
};

exports.Z = {
    _id: 'ZZ-ZZZZ',
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
        url: '/cities/' + city._id
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
