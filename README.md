# 💰 Zoryvn Finance API

A robust, production-ready RESTful API for personal finance management. Built with **Node.js**, **Express**, **MongoDB**, and **Redis**, this API powers features like secure authentication, transaction tracking, structured logging, intelligent caching, and comprehensive financial dashboard summaries.

---

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication and Role-Based Access Control (RBAC).
- **📊 Finance Management**: Create, read, update, income and expense records.
- **📈 Advanced Dashboard**: Get total summaries, category breakdowns, monthly trends, and top expenses.
- **⚡ Supercharged with Redis**: Response caching for dashboard data and immediate cache validations upon mutating transactions.
- **📑 OpenAPI Docs**: Interactive Swagger documentation integrated out of the box.
- **📝 Structured Logging**: Application-wide structured logging with Winston.

---

## 🛠️ Technology Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Caching & Rate Limiting:** Redis
- **Security:** Helmet, Express Rate Limit, CORS
- **Validation:** Joi
- **Documentation:** Swagger UI Express
- **Logger:** Winston

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or via Atlas
- [Redis](https://redis.io/download) running locally 

### 1. Installation
Clone the repo and install the dependencies:
```bash
npm install
```

### 2. Setup Environment
Create an environment file:
```
Edit `.env` and fill out your local configuration:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/financeDB
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### 3. Start the Application
To run the server in development mode with automatic reloads (nodemon):
```bash
npm run dev
```

To run the server in production mode:
```bash
npm start
```

### 4. Verify
Access the live Swagger documentation to interact with the API endpoints:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---


*Built for robust and scalable financial tracking.*
