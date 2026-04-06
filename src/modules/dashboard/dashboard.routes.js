const express = require('express');
const router = express.Router();

const controller = require('./dashboard.controller');
const auth = require('../../middleware/authMiddleware');
const validateQuery = require('../../middleware/validateQuery');
const redisCache = require('../../middleware/redisCache');
const { dashboardQuerySchema } = require('./dashboard.validation');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: >
 *     Analytics and summary endpoints for the user's financial data.
 *     All endpoints require a valid JWT Bearer token.
 *     All date filters are **optional** — omitting them returns data across all time.
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get total income, expense, and net balance
 *     description: >
 *       Returns aggregate totals for the authenticated user's financial records.
 *       Optionally filter by a single date or a date range.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by record type.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name.
 *     responses:
 *       200:
 *         description: Summary data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Summary fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/SummaryData'
 *             example:
 *               success: true
 *               message: Summary fetched successfully
 *               data:
 *                 totalIncome: 5000
 *                 totalExpense: 2000
 *                 netBalance: 3000
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// Cache the summary for 60 seconds since it's the most intensive operation
router.get('/summary', auth, validateQuery(dashboardQuerySchema), redisCache(60), controller.getSummary);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Get spending breakdown by category
 *     description: >
 *       Returns the total amount grouped by category, sorted by total descending.
 *       Useful for pie charts and category analysis.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by record type.
 *     responses:
 *       200:
 *         description: Category breakdown fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category breakdown fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/CategoryBreakdown'
 *             example:
 *               success: true
 *               message: Category breakdown fetched successfully
 *               data:
 *                 - _id: Groceries
 *                   total: 850.5
 *                 - _id: Rent
 *                   total: 1200
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/categories', auth, validateQuery(dashboardQuerySchema), controller.getCategoryWise);

/**
 * @swagger
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly income vs expense trends
 *     description: >
 *       Returns aggregated monthly totals for income and expenses.
 *       Useful for bar or line charts over time.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *     responses:
 *       200:
 *         description: Monthly trends fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Monthly trends fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/MonthlyTrend'
 *             example:
 *               success: true
 *               message: Monthly trends fetched successfully
 *               data:
 *                 - _id:
 *                     year: 2024
 *                     month: 10
 *                   income: 5000
 *                   expense: 2000
 *                 - _id:
 *                     year: 2024
 *                     month: 11
 *                   income: 4500
 *                   expense: 3100
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/trends', auth, validateQuery(dashboardQuerySchema), controller.getMonthlyTrends);

/**
 * @swagger
 * /dashboard/top-expenses:
 *   get:
 *     summary: Get the highest expense records
 *     description: >
 *       Returns the top N records by amount, sorted descending.
 *       **Always returns `expense` type records** — the type is fixed in the service.
 *       Use the `limit` parameter to control how many results to return (default: 5, max: 50).
 *       Optionally filter by category or date range.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter top expenses by category.
 *     responses:
 *       200:
 *         description: Top expenses fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Top expenses fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Record'
 *             example:
 *               success: true
 *               message: Top expenses fetched successfully
 *               data:
 *                 - _id: 60d21b4667d0d8992e610c85
 *                   amount: 1500
 *                   type: expense
 *                   category: Rent
 *                   date: '2024-10-01'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/top-expenses', auth, validateQuery(dashboardQuerySchema), controller.getTopExpenses);

/**
 * @swagger
 * /dashboard/recent:
 *   get:
 *     summary: Get the most recent transactions
 *     description: >
 *       Returns the most recently created financial records.
 *       Use the `limit` parameter to control how many results to return (default: 5, max: 50).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/DateParam'
 *       - $ref: '#/components/parameters/StartDateParam'
 *       - $ref: '#/components/parameters/EndDateParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by record type.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name.
 *     responses:
 *       200:
 *         description: Recent transactions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recent transactions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Record'
 *             example:
 *               success: true
 *               message: Recent transactions fetched successfully
 *               data:
 *                 - _id: 60d21b4667d0d8992e610c85
 *                   amount: 150.5
 *                   type: expense
 *                   category: Groceries
 *                   date: '2024-10-15'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/recent', auth, validateQuery(dashboardQuerySchema), controller.getRecentTransactions);

module.exports = router;