const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zoryvn Finance API',
      version: '1.0.0',
      description:
        'RESTful API for the Zoryvn personal finance management platform. ' +
        'Provides authentication, financial record CRUD, and dashboard analytics including ' +
        'summary totals, category breakdowns, monthly trends, top expenses, and recent transactions.',
      contact: {
        name: 'Zoryvn API Support',
        email: 'support@zoryvn.io'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],

    // ─── Reusable Components ──────────────────────────────────────────────────
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from the /auth/login endpoint.'
        }
      },

      schemas: {

        // ── Auth ──────────────────────────────────────────────────────────────
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Jane Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jane@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 100,
              example: 'securepass123'
            },
            role: {
              type: 'string',
              enum: ['viewer', 'analyst', 'admin'],
              default: 'viewer',
              example: 'viewer'
            }
          }
        },

        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'jane@example.com'
            },
            password: {
              type: 'string',
              example: 'securepass123'
            }
          }
        },

        // ── User ─────────────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '60d21b4667d0d8992e610c85' },
            name:      { type: 'string', example: 'Jane Doe' },
            email:     { type: 'string', format: 'email', example: 'jane@example.com' },
            role:      { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'viewer' },
            status:    { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ── Record ────────────────────────────────────────────────────────────
        Record: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '60d21b4667d0d8992e610c85' },
            userId:    { type: 'string', example: '60d21b4667d0d8992e610c80' },
            amount:    { type: 'number', example: 150.5 },
            type:      { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category:  { type: 'string', example: 'Groceries' },
            date:      { type: 'string', format: 'date', example: '2024-10-15' },
            notes:     { type: 'string', example: 'Weekly grocery shopping' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        RecordInput: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount:   { type: 'number', minimum: 0.01, example: 150.5 },
            type:     { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            category: { type: 'string', minLength: 2, example: 'Groceries' },
            date:     { type: 'string', format: 'date', example: '2024-10-15' },
            notes:    { type: 'string', maxLength: 500, example: 'Weekly grocery shopping' }
          }
        },

        RecordUpdateInput: {
          type: 'object',
          minProperties: 1,
          description: 'At least one field must be provided.',
          properties: {
            amount:   { type: 'number', minimum: 0.01, example: 200.0 },
            type:     { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: { type: 'string', minLength: 2, example: 'Salary' },
            date:     { type: 'string', format: 'date', example: '2024-11-01' },
            notes:    { type: 'string', maxLength: 500, example: 'Updated note' }
          }
        },

        // ── Paginated Records (actual GET /records response) ──────────────────
        PaginatedRecords: {
          type: 'object',
          properties: {
            success:    { type: 'boolean', example: true },
            message:    { type: 'string', example: 'Records fetched successfully' },
            total:      { type: 'integer', example: 42 },
            page:       { type: 'integer', example: 1 },
            totalPages: { type: 'integer', example: 9 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Record' }
            }
          }
        },

        // ── Dashboard ─────────────────────────────────────────────────────────
        SummaryData: {
          type: 'object',
          properties: {
            totalIncome:  { type: 'number', example: 5000 },
            totalExpense: { type: 'number', example: 2000 },
            netBalance:   { type: 'number', example: 3000 }
          }
        },

        CategoryBreakdown: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id:   { type: 'string', example: 'Groceries' },
              total: { type: 'number', example: 850.5 }
            }
          }
        },

        MonthlyTrend: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  year:  { type: 'integer', example: 2024 },
                  month: { type: 'integer', example: 10 }
                }
              },
              income:  { type: 'number', example: 5000 },
              expense: { type: 'number', example: 2000 }
            }
          }
        },

        // ── Common Responses ──────────────────────────────────────────────────
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user:  { $ref: '#/components/schemas/User' }
              }
            }
          }
        },

        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data:    { type: 'object' }
          }
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' }
          }
        }
      },

      // ── Reusable Parameters ───────────────────────────────────────────────
      parameters: {
        RecordId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'MongoDB ObjectId of the record',
          example: '60d21b4667d0d8992e610c85'
        },
        DateParam: {
          in: 'query',
          name: 'date',
          schema: { type: 'string', format: 'date' },
          description: 'Filter by exact date (YYYY-MM-DD). Cannot be used with startDate/endDate.',
          example: '2024-10-15'
        },
        StartDateParam: {
          in: 'query',
          name: 'startDate',
          schema: { type: 'string', format: 'date' },
          description: 'Start of date range (YYYY-MM-DD).',
          example: '2024-10-01'
        },
        EndDateParam: {
          in: 'query',
          name: 'endDate',
          schema: { type: 'string', format: 'date' },
          description: 'End of date range (YYYY-MM-DD).',
          example: '2024-10-31'
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 50, default: 5 },
          description: 'Maximum number of results to return.'
        }
      },

      // ── Reusable Responses ────────────────────────────────────────────────
      responses: {
        Unauthorized: {
          description: 'Unauthorized — missing or invalid JWT token.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Access denied. No token provided.' }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden — insufficient role permissions.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Access denied. Insufficient permissions.' }
            }
          }
        },
        NotFound: {
          description: 'Not Found — the requested resource does not exist.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Record not found' }
            }
          }
        },
        BadRequest: {
          description: 'Bad Request — validation failed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'amount must be a positive number' }
            }
          }
        },
        InternalError: {
          description: 'Internal Server Error.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Internal Server Error' }
            }
          }
        }
      }
    },

    // Global security — applied by default unless overridden per-route
    security: [{ bearerAuth: [] }]
  },

  // Scan all module route files for JSDoc @swagger annotations
  apis: ['./src/modules/**/*.routes.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;