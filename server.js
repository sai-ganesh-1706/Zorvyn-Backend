require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');
const { connectRedis } = require('./src/config/redis');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  await connectRedis();
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
