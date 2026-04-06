const service = require('./record.service');
const logger = require('../../utils/logger');
const redisCache = require('../../middleware/redisCache');

// ================= CREATE =================
exports.create = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[RECORDS][CREATE] Request by user: ${userInfo}`);

  try {
    const record = await service.createRecord(req.body, req.user);
    logger.info(`[RECORDS][CREATE] Success | recordId: ${record._id} | user: ${userInfo}`);
    await redisCache.clearUserCache(req.user.id);

    return res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: record
    });
  } catch (err) {
    logger.error(`[RECORDS][CREATE] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  logger.info(`[RECORDS][FETCH] Request by user: ${userInfo} | query: ${JSON.stringify(req.query)}`);

  try {
    const data = await service.getRecords(req.query, req.user);
    logger.info(`[RECORDS][FETCH] Success | user: ${userInfo} | total: ${data.total}`);

    return res.json({
      success: true,
      message: 'Records fetched successfully',
      ...data
    });
  } catch (err) {
    logger.error(`[RECORDS][FETCH] Failed | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  const recordId = req.params.id;
  logger.info(`[RECORDS][UPDATE] Request | recordId: ${recordId} | user: ${userInfo}`);

  try {
    const record = await service.updateRecord(recordId, req.body, req.user);
    logger.info(`[RECORDS][UPDATE] Success | recordId: ${recordId} | user: ${userInfo}`);
    await redisCache.clearUserCache(req.user.id);

    return res.json({
      success: true,
      message: 'Record updated successfully',
      data: record
    });
  } catch (err) {
    logger.error(`[RECORDS][UPDATE] Failed | recordId: ${recordId} | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ================= DELETE =================
exports.delete = async (req, res) => {
  const userInfo = `${req.user?.email || 'unknown'} (${req.user?.id})`;
  const recordId = req.params.id;
  logger.info(`[RECORDS][DELETE] Request | recordId: ${recordId} | user: ${userInfo}`);

  try {
    await service.deleteRecord(recordId, req.user);
    logger.info(`[RECORDS][DELETE] Success | recordId: ${recordId} | user: ${userInfo}`);
    await redisCache.clearUserCache(req.user.id);

    return res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (err) {
    logger.error(`[RECORDS][DELETE] Failed | recordId: ${recordId} | user: ${userInfo} | error: ${err.message}`);
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};
