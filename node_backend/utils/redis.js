import Redis from 'ioredis';

const targetErrors = /(READONLY|ETIMEDOUT)/;

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  connectTimeout: 5000,
  keepAlive: false,
  keyPrefix: process.env.ENV === 'PROD' ? '' : `${process.env.ENV || 'DEV'}-`,
  lazyConnect: true,
  maxRetriesPerRequest: 4,
  tls: process.env.REDIS_HOST === 'localhost' ? undefined : {},
  retryStrategy: (times) => {
    console.debug(`ioredis retry attempt ${times}`);
    return Math.min(times * 30, 1000);
  },
  reconnectOnError: (error) => {
    if (targetErrors.test(error.message)) {
      console.debug(`Redis attempting to reconnect after "${error.message}" error`);
      return true;
    } else {
      console.debug('ioredis error not retried');
    }
  },
});

redis.on('error', (e) => {
  console.debug(`redis error: ${e.message}`);
});

export default redis;
