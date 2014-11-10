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
  redis_options: {
    // https://github.com/mranney/node_redis#rediscreateclient
  }
}));
```

### Example

```
var koa = require('koa');
var redisPool = require('koa-redis-pool');

var app = koa();
app.use(redisPool({log: true}));

app.use(function* (next) {
  this.redis.set('name', 'nswbmw');
  yield next;
  this.redis.get('name', function (err, name) {
    console.log(name);
  });
});

app.listen(3000);
```

### License

MIT