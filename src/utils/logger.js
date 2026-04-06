const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

// Root-level logs directory (project_root/logs/)
// __dirname = src/utils  →  ../../ = project root
const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',

  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),

  transports: [
    // Colourised console output
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `[${timestamp}] ${level}: ${stack}`
            : `[${timestamp}] ${level}: ${message}`;
        })
      )
    }),

    // Error-only log file
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),

    // Combined log file (all levels)
    new transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

module.exports = logger;