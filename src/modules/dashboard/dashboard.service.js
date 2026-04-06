const Record = require('../records/record.model');
const mongoose = require('mongoose');
const logger = require('../../utils/logger');


// ================= COMMON MATCH BUILDER =================
const buildMatch = (user, query = {}) => {
  const match = {
    userId: new mongoose.Types.ObjectId(user.id)
  };

  // SINGLE DATE
  if (query.date) {
    const start = new Date(query.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(query.date);
    end.setHours(23, 59, 59, 999);

    match.date = { $gte: start, $lte: end };
  }

  //  DATE RANGE
  else if (query.startDate || query.endDate) {
    match.date = {};

    if (query.startDate) {
      match.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      match.date.$lte = new Date(query.endDate);
    }
  }

  //  TYPE FILTER
  if (query.type) {
    match.type = query.type;
  }

  //  CATEGORY FILTER
  if (query.category) {
    match.category = query.category;
  }

  return match;
};


// ================= SUMMARY =================
exports.getSummary = async (user, query = {}) => {
  logger.info(`[DASHBOARD][SERVICE][SUMMARY] Building summary for user: ${user.id}`);
  const match = buildMatch(user, query);

  const data = await Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0;
  let expense = 0;

  data.forEach(item => {
    if (item._id === 'income') income = item.total;
    if (item._id === 'expense') expense = item.total;
  });

  const result = { totalIncome: income, totalExpense: expense, netBalance: income - expense };
  logger.info(`[DASHBOARD][SERVICE][SUMMARY] Done | income: ${income} | expense: ${expense} | user: ${user.id}`);
  return result;
};


// ================= CATEGORY =================
exports.getCategoryWise = async (user, query = {}) => {
  logger.info(`[DASHBOARD][SERVICE][CATEGORIES] Building category breakdown for user: ${user.id}`);
  const match = buildMatch(user, query);

  const result = await Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } }
  ]);
  logger.info(`[DASHBOARD][SERVICE][CATEGORIES] Done | ${result.length} categories | user: ${user.id}`);
  return result;
};


// ================= MONTHLY =================
exports.getMonthlyTrends = async (user, query = {}) => {
  logger.info(`[DASHBOARD][SERVICE][TRENDS] Building monthly trends for user: ${user.id}`);
  const match = buildMatch(user, query);

  const result = await Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    }
  ]);
  logger.info(`[DASHBOARD][SERVICE][TRENDS] Done | ${result.length} months | user: ${user.id}`);
  return result;
};


// ================= TOP EXPENSES =================
exports.getTopExpenses = async (user, query = {}) => {
  logger.info(`[DASHBOARD][SERVICE][TOP_EXPENSES] Fetching top expenses for user: ${user.id}`);
  const match = buildMatch(user, query);

  // Always filter to expenses only
  match.type = 'expense';

  const limit = parseInt(query.limit) || 5;

  const result = await Record.find(match).sort({ amount: -1 }).limit(limit);
  logger.info(`[DASHBOARD][SERVICE][TOP_EXPENSES] Done | ${result.length} records | user: ${user.id}`);
  return result;
};


// ================= RECENT =================
exports.getRecentTransactions = async (user, query = {}) => {
  logger.info(`[DASHBOARD][SERVICE][RECENT] Fetching recent transactions for user: ${user.id}`);
  const match = buildMatch(user, query);

  const limit = parseInt(query.limit) || 5;

  const result = await Record.find(match).sort({ createdAt: -1 }).limit(limit);
  logger.info(`[DASHBOARD][SERVICE][RECENT] Done | ${result.length} records | user: ${user.id}`);
  return result;
};