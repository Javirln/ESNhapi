'use strict';

exports.getAll = {
    method: 'GET',
    url: '/partners'
};

exports.get = (partners) => {
    return {
        method: 'GET',
        url: '/partners/' + partners.code
    }
};

exports.A = {
    "code": "AA-AAAA-AAA-partners-1234",
    "name": "Awesome partner name",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "moreInformation": "Bar's website",
    "country": "AA",
    "city": "AA-AAAA",
    "section": "AA-AAAA-AAAA"
};

exports.B = {
    "code": "AA-AABB-AABB-partners-1234",
    "name": "Awesome partner name",
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "moreInformation": "Bar's website",
    "country": "AA",
    "city": "AA-AABB",
    "section": "AA-AABB-AABB"
};

exports.delete = (partners) => {
    return {
        method: 'DELETE',
        url: '/partners/' + partners.code
    }
};

exports.create = (partners) => {
    return {
        method: 'POST',
        url: '/partners',
        payload: partners
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
