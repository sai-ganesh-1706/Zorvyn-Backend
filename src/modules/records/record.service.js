const Record = require('./record.model');
const mongoose = require('mongoose');
const AppError = require('../../utils/AppError');
const logger = require('../../utils/logger');

// ================= CREATE =================
exports.createRecord = async (data, user) => {
  if (data.amount <= 0) {
    logger.warn(`[RECORDS][SERVICE][CREATE] Invalid amount ${data.amount} by user: ${user.id}`);
    throw new AppError('Amount must be positive', 400);
  }

  const record = await Record.create({ ...data, userId: user.id });
  logger.info(`[RECORDS][SERVICE][CREATE] Record ${record._id} created for user: ${user.id}`);
  return record;
};

// ================= GET ALL =================
exports.getRecords = async (query, user) => {
  const filter = {
    userId: new mongoose.Types.ObjectId(user.id)
  };

  // Single date filter
  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }
  // Date range filter
  else if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate)   filter.date.$lte = new Date(query.endDate);
  }

  // Optional filters
  if (query.type)     filter.type = query.type;
  if (query.category) filter.category = query.category;

  // Sorting
  const sortField = query.sortBy || 'date';
  const sortOrder = query.order === 'asc' ? 1 : -1;

  // Pagination
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 5;
  const skip  = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Record.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Record.countDocuments(filter)
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: records
  };
};

// ================= UPDATE =================
exports.updateRecord = async (id, data, user) => {
  const record = await Record.findOne({ _id: id, userId: user.id });

  if (!record) {
    logger.warn(`[RECORDS][SERVICE][UPDATE] Record ${id} not found for user: ${user.id}`);
    throw new AppError('Record not found', 404);
  }

  Object.assign(record, data);
  await record.save();
  logger.info(`[RECORDS][SERVICE][UPDATE] Record ${id} updated by user: ${user.id}`);

  return record;
};

// ================= DELETE =================
exports.deleteRecord = async (id, user) => {
  const record = await Record.findOneAndDelete({ _id: id, userId: user.id });

  if (!record) {
    logger.warn(`[RECORDS][SERVICE][DELETE] Record ${id} not found for user: ${user.id}`);
    throw new AppError('Record not found', 404);
  }

  logger.info(`[RECORDS][SERVICE][DELETE] Record ${id} deleted by user: ${user.id}`);
  return { message: 'Deleted successfully' };
};
