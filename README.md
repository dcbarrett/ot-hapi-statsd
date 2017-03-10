ot-hapi-statsd (Plugin)
==================

## CURRENT REQUIREMENTS
---------
node >= 4

## CODING STANDARDS
Don't use `var`.
Use `const` where possible, `let` where not.

DESCRIPTION
===========
Hapi.js Plugin for [statsd](https://github.com/etsy/statsd).

This will track your
    - Count: incoming Request by path
    - Timing: response by path
    - Count: response by url and status code

STATSD
=======
    - For Ex' [GET] /users/all -> Response [200]
    - onRequest
        - Count: increment `request.in.users.all'
    - onPreResponse
        - Count increment `response.out.users.all.200`
        - Timer `request.users.all`

[![Build Status](https://secure.travis-ci.org/opentable/ot-hapi-statsd.png?branch=master)](http://travis-ci.org/opentable/ot-hapi-statsd)

Quick tour
----------

```javascript
//SERVER:

server.register([
    register: require('ot-hapi-statsd'),
    options: {
        host: 'statsd.localhost', // your statsd host
        prefix: 'node-app.development.local.', // Prefix
        port: 8125, //must be a number default 8125
        debug: true //could be true/false
        removePath: {
          number: 1, // MUST BE INTEGER
          regex: '/\[[0-9]+\]/' //when to remove part of the path when empty it will on all the routes
        }
    }
])...
```

Github
-------------
Check the [GitHub issues](https://github.com/opentable/ot-hapi-statsd/issues).

LICENSE
-------
[LICENSE](https://github.com/opentable/ot-hapi-statsd/blob/master/LICENSE).
