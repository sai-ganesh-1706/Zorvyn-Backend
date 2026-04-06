const express = require('express');
const router = express.Router();

const controller = require('./record.controller');
const auth = require('../../middleware/authMiddleware');
const role = require('../../middleware/roleMiddleware');
const validate = require('../../middleware/validate');
const validateQuery = require('../../middleware/validateQuery');
const { createRecordSchema, updateRecordSchema, querySchema } = require('./record.validation');

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: >
 *     Financial record management (income & expense entries).
 *     All endpoints require a valid JWT Bearer token.
 *     Create, update, and delete operations are restricted to **admin** role only.
 */

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all records (paginated & filterable)
 *     description: >
 *       Returns a paginated list of the authenticated user's financial records.
 *       Supports filtering by date, date range, type, and category.
 *       Supports sorting by `amount`, `date`, or `createdAt`.
 *       All filter parameters are **optional** — omitting them returns all records.
 *     tags: [Records]
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
 *         description: Filter by category name (case-sensitive).
 *         example: Groceries
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Number of records per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [amount, date, createdAt]
 *         description: Field to sort results by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction.
 *     responses:
 *       200:
 *         description: Records fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedRecords'
 *             example:
 *               success: true
 *               message: Records fetched successfully
 *               total: 42
 *               page: 1
 *               totalPages: 9
 *               data:
 *                 - _id: 60d21b4667d0d8992e610c85
 *                   amount: 150.5
 *                   type: expense
 *                   category: Groceries
 *                   date: '2024-10-15'
 *                   notes: Weekly grocery shopping
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', auth, validateQuery(querySchema), controller.getAll);

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new financial record
 *     description: >
 *       Creates a new income or expense record for the authenticated user.
 *       **Requires admin role.**
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordInput'
 *           example:
 *             amount: 150.5
 *             type: expense
 *             category: Groceries
 *             date: '2024-10-15'
 *             notes: Weekly grocery shopping
 *     responses:
 *       201:
 *         description: Record created successfully.
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
 *                   example: Record created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Record'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', auth, role('admin'), validate(createRecordSchema), controller.create);

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update an existing financial record
 *     description: >
 *       Updates one or more fields of an existing record.
 *       At least one field must be provided in the request body.
 *       **Requires admin role.** Only the owner's records can be updated.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecordId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordUpdateInput'
 *           example:
 *             amount: 200
 *             notes: Updated note
 *     responses:
 *       200:
 *         description: Record updated successfully.
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
 *                   example: Record updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Record'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', auth, role('admin'), validate(updateRecordSchema), controller.update);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     description: >
 *       Permanently deletes a record by ID.
 *       **Requires admin role.** Only the owner's records can be deleted.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/RecordId'
 *     responses:
 *       200:
 *         description: Record deleted successfully.
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
 *                   example: Record deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', auth, role('admin'), controller.delete);

module.exports = router;