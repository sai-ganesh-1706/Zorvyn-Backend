const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => logger.error(`Redis Error: ${err.message}`));
client.on('connect', () => logger.info('Redis Connected'));

const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (err) {
    logger.error(`Redis connection failed: ${err.message}`);
  }
};

module.exports = { client, connectRedis };
