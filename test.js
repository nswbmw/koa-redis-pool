'use strict';

var koa = require('koa');
var redisPool = require('./');

var app = koa();

app.use(redisPool());

app.use(function* (next) {
  yield this.redis.set('name', 'nswbmw');
  yield* next;
  this.body = yield this.redis.get('name');
});

app.listen(3000);