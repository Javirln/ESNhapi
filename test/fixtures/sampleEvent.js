'use strict';

exports.getAll = {
    method: 'GET',
    url: '/events'
};

exports.get = (events) => {
    return {
        method: 'GET',
        url: '/events/' + events.code
    }
};

exports.A = {
    "code": "AA-AAAA-AAA-events-1234",
    "title": "Awesome title",
    "dateStarts": "2016-06-05T12:32:35+02:00",
    "dateEnds": "2016-06-10T12:00:00+02:00",
    "place": "Antartica",
    "price": "19,95€",
    "eventType": [
        "string"
    ],
    "meetingPoint": "Midtown",
    "moreInformation": [
        "string"
    ],
    "included": [
        "string"
    ],
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "address": {
        "country": "string",
        "administrative_area": "string",
        "sub_administrative_area": "string",
        "locality": "string",
        "dependent_locality": "string",
        "postal_code": "string",
        "thoroughfare": "string",
        "premise": "string",
        "sub_premise": "string",
        "organisation_name": "string",
        "name_line": "string",
        "first_name": "string",
        "last_name": "string",
        "data": "string"
    },
    "location": "POINT (-0.1214235 40.6650743)",
    "country": "AA",
    "city": "AA-AAAA",
    "section": "AA-AAAA-AAAA"
};

exports.B = {
    "code": "AA-AABB-AABB-events-1234",
    "title": "Awesome title",
    "dateStarts": "2016-06-05T12:32:35+02:00",
    "dateEnds": "2016-06-10T12:00:00+02:00",
    "place": "Antartica",
    "price": "19,95€",
    "eventType": [
        "string"
    ],
    "meetingPoint": "Midtown",
    "moreInformation": [
        "string"
    ],
    "included": [
        "string"
    ],
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "address": {
        "country": "string",
        "administrative_area": "string",
        "sub_administrative_area": "string",
        "locality": "string",
        "dependent_locality": "string",
        "postal_code": "string",
        "thoroughfare": "string",
        "premise": "string",
        "sub_premise": "string",
        "organisation_name": "string",
        "name_line": "string",
        "first_name": "string",
        "last_name": "string",
        "data": "string"
    },
    "location": "POINT (-0.1214235 40.6650743)",
    "country": "AA",
    "city": "AA-AABB",
    "section": "AA-AABB-AABB"
};

exports.delete = (events) => {
    return {
        method: 'DELETE',
        url: '/events/' + events.code
    }
};

exports.create = (events) => {
    return {
        method: 'POST',
        url: '/events',
        payload: events
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
