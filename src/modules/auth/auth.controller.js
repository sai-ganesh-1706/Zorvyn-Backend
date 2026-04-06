const service = require('./auth.service');
const logger = require('../../utils/logger');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { email } = req.body;

  logger.info(`Registration attempt: ${email}`);

  try {
    // Data already validated via Joi middleware
    const user = await service.register(req.body);

    logger.info(`User registered successfully: ${email}`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });

  } catch (err) {
    logger.error(`Registration failed for ${email}: ${err.message}`);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email } = req.body;

  logger.info(`Login attempt: ${email}`);

  try {
    // Data already validated via Joi middleware
    const data = await service.login(req.body.email, req.body.password);

    logger.info(`Login successful: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data
    });

  } catch (err) {
    logger.error(`Login failed for ${email}: ${err.message}`);

    return res.status(err.statusCode || 401).json({
      success: false,
      message: err.message || 'Invalid credentials',
    });
  }
};