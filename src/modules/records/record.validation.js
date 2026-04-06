const Joi = require('joi');

// ================= CREATE RECORD =================
exports.createRecordSchema = Joi.object({
  amount: Joi.number().positive().required(),

  type: Joi.string()
    .valid('income', 'expense')
    .required(),

  category: Joi.string()
    .trim()
    .min(2)
    .required(),

  date: Joi.date()
    .required(),

  notes: Joi.string()
    .allow('')
    .max(500)
});


// ================= UPDATE RECORD =================
// All fields optional (user may update only some)
exports.updateRecordSchema = Joi.object({
  amount: Joi.number().positive(),

  type: Joi.string()
    .valid('income', 'expense'),

  category: Joi.string()
    .trim()
    .min(2),

  date: Joi.date(),

  notes: Joi.string()
    .allow('')
    .max(500)
}).min(1); // at least one field must be provided


// ================= QUERY / FILTER =================
exports.querySchema = Joi.object({
  // Single date — mutually exclusive with startDate/endDate
  date: Joi.date()
    .when('startDate', { is: Joi.exist(), then: Joi.forbidden() })
    .when('endDate',   { is: Joi.exist(), then: Joi.forbidden() }),

  // Date range — both must be provided together; forbidden if `date` is used
  startDate: Joi.date(),
  endDate:   Joi.date().min(Joi.ref('startDate')),

  type:     Joi.string().valid('income', 'expense'),
  category: Joi.string().trim(),

  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(5),

  sortBy: Joi.string().valid('amount', 'date', 'createdAt'),
  order:  Joi.string().valid('asc', 'desc').default('desc')
})
  // If startDate is given, endDate is required (and vice-versa)
  .and('startDate', 'endDate');