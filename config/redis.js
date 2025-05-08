const Redis = require('ioredis');

//By default, it will connect to localhost:6379
const redis = new Redis();

module.exports = redis;