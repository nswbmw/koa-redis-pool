var redis = require('redis');
var debug = require('debug')('koa-redis-pool');
var poolModule = require('generic-pool');

module.exports = redisPool;

function redisPool(options) {
  options = options || {};
  var host = options.host || 'localhost';
  var port = options.port || 6379;
  var max = options.max || 100;
  var min = options.min || 1;
  var timeout = options.timeout || 30000;
  var log = options.log || false;
  var db = options.db || 0;
  var redis_options = options.redis_options || {};
  
  return function* (next) {
    if (!this.app._redisPool) {
      debug('Redis connect: ' + host + ':' + port);
      this.app._redisPool = poolModule.Pool({
        name     : 'koa-redis-pool',
        create   : function(callback) {
          var client = redis.createClient(port, host, redis_options);
          client.select(db, function () {
            callback(null, client);
          });
        },
        destroy  : function(client) {client.end();},
        max      : max,
        min      : min, 
        idleTimeoutMillis : timeout,
        log : log 
      });
    }
    this.redis = yield this.app._redisPool.acquire;
    if (!this.redis) this.throw('Fail to acquire one redis connection')
    debug('Acquire one connection');

    yield next;

    this.app._redisPool.release(this.redis);
    debug('Release one connection');
  }
} 