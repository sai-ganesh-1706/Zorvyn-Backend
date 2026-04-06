const logger = require('../utils/logger');

module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/"/g, '')).join('; ');

      logger.warn(`[VALIDATE] Body validation failed on [${req.method} ${req.originalUrl}]: ${messages}`);

      return res.status(400).json({
        success: false,
        message: messages
      });
    }

    req.body = value; // use sanitized/coerced value
    next();
  };
};