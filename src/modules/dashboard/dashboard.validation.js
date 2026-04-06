const Joi = require('joi');

exports.dashboardQuerySchema = Joi.object({
  // Single date (optional)
  date: Joi.date(),

  // Date range (both optional)
  startDate: Joi.date(),
  endDate: Joi.date(),

  // Type filter
  type: Joi.string().valid('income', 'expense'),

  // Category filter
  category: Joi.string().trim(),

  // Result limit (for top-expenses and recent APIs)
  limit: Joi.number().integer().min(1).max(50).default(5)
});