const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  // Log full stack in development, concise message in production
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`[ERROR HANDLER] ${req.method} ${req.originalUrl} → ${statusCode}\n${err.stack}`);
  } else {
    logger.error(`[ERROR HANDLER] ${req.method} ${req.originalUrl} → ${statusCode}: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};