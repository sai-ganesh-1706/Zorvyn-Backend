const logger = require('../utils/logger');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      logger.warn(
        `[RBAC] Access denied | user: ${req.user?.email} (role: ${req.user?.role}) | required: [${roles.join(', ')}] | route: ${req.method} ${req.originalUrl}`
      );
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};