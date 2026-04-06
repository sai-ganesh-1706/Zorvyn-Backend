const User = require('../users/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');

// ================= REGISTER =================
exports.register = async (data) => {
  logger.info(`[AUTH] Checking if user exists: ${data.email}`);
  const existing = await User.findOne({ email: data.email });

  if (existing) {
    logger.warn(`[AUTH] Registration blocked — user already exists: ${data.email}`);
    throw new AppError('User already exists', 409);
  }

  logger.info(`[AUTH] Hashing password for: ${data.email}`);
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({ ...data, password: hashedPassword });
  logger.info(`[AUTH] New user created in DB: ${data.email}`);

  const { password, ...safeUser } = user.toObject();
  return safeUser;
};

// ================= LOGIN =================
exports.login = async (email, password) => {
  logger.info(`[AUTH] Looking up user: ${email}`);
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn(`[AUTH] Login failed — user not found: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn(`[AUTH] Login failed — wrong password for: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }

  logger.info(`[AUTH] Issuing JWT token for: ${email} (role: ${user.role})`);
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const { password: _, ...safeUser } = user.toObject();
  return { user: safeUser, token };
};