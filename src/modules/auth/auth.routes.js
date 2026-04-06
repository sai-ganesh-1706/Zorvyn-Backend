const express = require('express');
const router = express.Router();

const controller = require('./auth.controller');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: >
 *     User registration and authentication.
 *     All endpoints in this group do **not** require a Bearer token.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account. Role defaults to `viewer` if not specified.
 *       Returns the created user object (without password).
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *           example:
 *             name: Jane Doe
 *             email: jane@example.com
 *             password: securepass123
 *             role: viewer
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User registered successfully }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error — missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: password is required
 *       409:
 *         description: Conflict — a user with this email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: User already exists
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and obtain a JWT token
 *     description: >
 *       Authenticates a user with email and password.
 *       Returns a signed JWT token (valid for 7 days) and the user's profile.
 *       Use the token as a **Bearer token** in the `Authorization` header for all protected endpoints.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: jane@example.com
 *             password: securepass123
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token and user profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   _id: 60d21b4667d0d8992e610c85
 *                   name: Jane Doe
 *                   email: jane@example.com
 *                   role: viewer
 *       400:
 *         description: Validation error — missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: email is required
 *       401:
 *         description: Unauthorized — invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid email or password
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
