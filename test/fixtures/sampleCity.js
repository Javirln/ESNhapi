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
    name: 'Focksy',
    otherNames: [
        'Fockser'
    ]
};

exports.B = {
    _id: 'AA-AABB',
    country: 'AA',
    name: 'Rocksy',
    otherNames: [
        'Rockser'
    ]
};

exports.Z = {
    _id: 'AB-AABB',
    country: 'AB',
    name: 'Brox',
    otherNames: [
        'Broxers'
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
