'use strict';

exports.get = {
    method: 'GET',
    url: '/news'
};

exports.getSpecific = (news) => {

    return {
        method: 'GET',
        url: '/news/' + news.code
    }
};

exports.A = {
    "code": "AA-AAAA-AAAA-news-00",
    "title": "Title for news A",
    "content": "Sample content",
    "country": "AA",
    "city": "AA-AAAA",
    "section": "AA-AAAA-AAAA"
};

exports.B = {
    "code": "AA-AABB-AABB-news-00",
    "title": "Title for news B",
    "content": "Sample content",
    "country": "AA",
    "city": "AA-AABB",
    "section": "AA-AABB-AABB"
};

exports.create = (news) => {
    return {
        method: 'POST',
        url: '/news',
        payload: news
    }
};

exports.successPOST = {
    ok: 1,
    n: 1
};
