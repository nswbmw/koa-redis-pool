'use strict';

var Redis = require('ioredis');
var debug = require('debug')('koa-redis-pool');
var poolModule = require('generic-pool');
var merge = require('merge-descriptors');

var defaultOptions = {
  max: 100,
  min: 1,
  timeout: 30000,
  log: false
};

module.exports = function(options) {
  options = options || {};
  if ('string' === typeof options) {
    options = { url: options };
  }
  options = merge(defaultOptions, options);

  var _redisPool = poolModule.Pool({
    name     : 'koa-redis-pool',
    create   : function(callback) {
      var client;
      if (options.url) {
        client = new Redis(options.url);
      } else {
        client = new Redis(options);
      }
      client.once('error', function (e) {
        console.error(e);
        callback(e);
      });

      client.once('connect', function () {
        callback(null, client);
      });
    },
    destroy  : function (client) {
      client.end();
    },
    max      : options.max,
    min      : options.min, 
    idleTimeoutMillis : options.timeout,
    log : options.log 
  });

  return function* redisPool(next) {
    this.redis = yield _redisPool.acquire.bind(_redisPool);
    if (!this.redis) this.throw('Fail to acquire one redis connection');
    debug('Acquire one connection');

    try {
      yield next;
    } catch (e) {
      throw e;
    } finally {
      _redisPool.release(this.redis);
      debug('Release one connection');
    }
  };
};