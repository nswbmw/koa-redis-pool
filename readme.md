## koa-redis-pool

koa-redis-pool is a redis middleware for koa, support connection pool.

### Install

    npm i koa-redis-pool --save

### Usage

```
app.use(redisPool({
  host: 'localhost',
  port: 6379,
  max: 100,
  min: 1,
  timeout: 30000,
  log: false,
  db: 0,
  ... // https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
}));
```

### Example

```
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
```

### License

MIT