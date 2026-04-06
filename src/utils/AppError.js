/**
 * Custom application error class.
 * Allows services to throw errors with specific HTTP status codes
 * so controllers can respond appropriately without defaulting to 500.
 *
 * @example
 *   throw new AppError('User already exists', 409);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
