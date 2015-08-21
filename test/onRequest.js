'use strict';

var expect = require('expect.js');
var os = require('os');
var rewire = require('rewire');
var plugin = rewire('../src/plugin.js');

describe('onRequest', function() {
  describe('Plugin', function() {
      var incrementName = [];
      var firstIncCall = 'request.in._test_endpoint.counter';
      var secondIncCall = 'request.in.Total.counter';
    before(function(done){
        var settings = {
            host: 'statsd.localhost',
            prefix: 'search-api-node.development.local.',
            port: 8125,
            debug: true
        };
        plugin.register({
            ext: function(_, handler) {
                plugin.__set__('sdc', {
                    increment: function(name) {
                        if (_ === 'onRequest') {
                            incrementName.push(name);
                        }
                    },
                    timing: function(name, value) {
                        return;
                    }
                });

                handler({
                    info: {
                        received: new Date()
                    },
                    method: 'get',
                    response: {
                        statusCode: 200
                    },
                    path: '/test/endpoint',
                    route: {
                        settings: {
                            plugins: {
                                'hapi-statsd': {
                                    endpoint: 'test/endpoint',
                                    version: 'test-version'
                                }
                            }
                        }
                    }
                }, {
                    continue: function() {
                        done();
                    }
                });
                }
            }, settings, function() {});
        });
        it('Counter first call should be equal : `'+ firstIncCall +'`', function() {
            expect(incrementName[0]).to.equal(firstIncCall);
        });
        it('Counter second call should be equal : `'+ secondIncCall +'`', function() {
            expect(incrementName[1]).to.equal(secondIncCall)            
        });
       
    });
  });