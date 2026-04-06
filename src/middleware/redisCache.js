const { client } = require('../config/redis');
const logger = require('../utils/logger');

const redisCache = (duration = 60) => async (req, res, next) => {
  if (req.method !== 'GET') return next();

  try {
    if (!client.isOpen) return next();

    // Simple cache key based on URL and user ID
    const key = `cache:${req.user ? req.user.id : 'anon'}:${req.originalUrl}`;
    const cachedData = await client.get(key);

    if (cachedData) {
      logger.info(`Cache hit for ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    // Intercept response to save to cache
    const originalJson = res.json;
    res.json = (body) => {
      client.setEx(key, duration, JSON.stringify(body))
        .catch(err => logger.error(`Cache set error: ${err.message}`));
      res.json = originalJson;
      return res.json(body);
    };

    next();
  } catch (err) {
    logger.error(`Cache middleware error: ${err.message}`);
    next();
  }
};

module.exports = redisCache;
