const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// DB connect
connectDB();

// ─── Core Middlewares  ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Simple in-memory rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Apply to all routes
app.use(limiter);

// ─── API Documentation ───────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Zoryvn Finance API Docs',
  swaggerOptions: { persistAuthorization: true }
}));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Zoryvn Finance API is running' });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/auth', require('./modules/auth/auth.routes'));
app.use('/records', require('./modules/records/record.routes'));
app.use('/dashboard', require('./modules/dashboard/dashboard.routes'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
