const service = require('./dashboard.service');
const logger = require('../../utils/logger');

// ================= SUMMARY =================
exports.getSummary = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[DASHBOARD][SUMMARY] Request | user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getSummary(req.user, req.query);
    logger.info(`[DASHBOARD][SUMMARY] Success | user: ${userInfo}`);

    return res.json({ success: true, message: 'Summary fetched successfully', data });
  } catch (err) {
    logger.error(`[DASHBOARD][SUMMARY] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= CATEGORY BREAKDOWN =================
exports.getCategoryWise = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[DASHBOARD][CATEGORIES] Request | user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getCategoryWise(req.user, req.query);
    logger.info(`[DASHBOARD][CATEGORIES] Success | user: ${userInfo}`);

    return res.json({ success: true, message: 'Category breakdown fetched successfully', data });
  } catch (err) {
    logger.error(`[DASHBOARD][CATEGORIES] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= MONTHLY TRENDS =================
exports.getMonthlyTrends = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[DASHBOARD][TRENDS] Request | user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getMonthlyTrends(req.user, req.query);
    logger.info(`[DASHBOARD][TRENDS] Success | user: ${userInfo}`);

    return res.json({ success: true, message: 'Monthly trends fetched successfully', data });
  } catch (err) {
    logger.error(`[DASHBOARD][TRENDS] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= TOP EXPENSES =================
exports.getTopExpenses = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[DASHBOARD][TOP_EXPENSES] Request | user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getTopExpenses(req.user, req.query);
    logger.info(`[DASHBOARD][TOP_EXPENSES] Success | user: ${userInfo} | count: ${data.length}`);

    return res.json({ success: true, message: 'Top expenses fetched successfully', data });
  } catch (err) {
    logger.error(`[DASHBOARD][TOP_EXPENSES] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= RECENT TRANSACTIONS =================
exports.getRecentTransactions = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[DASHBOARD][RECENT] Request | user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getRecentTransactions(req.user, req.query);
    logger.info(`[DASHBOARD][RECENT] Success | user: ${userInfo} | count: ${data.length}`);

    return res.json({ success: true, message: 'Recent transactions fetched successfully', data });
  } catch (err) {
    logger.error(`[DASHBOARD][RECENT] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};