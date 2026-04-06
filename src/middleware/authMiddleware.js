const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`[AUTH] Missing or malformed Authorization header on ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn(`[AUTH] Token expired on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }

    logger.warn(`[AUTH] Invalid token on ${req.method} ${req.originalUrl}: ${err.message}`);
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};