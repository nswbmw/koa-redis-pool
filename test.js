var koa = require('koa');
var redisPool = require('./');

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