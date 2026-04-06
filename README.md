# Zoryvn Finance API

A REST API for personal finance management built with **Node.js**, **Express**, **MongoDB**, and **Redis**.

---

## 🐳 Docker Setup

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/install/) v2 (comes bundled with Docker Desktop)

### 1. Configure environment
```bash
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

### 2. Start all services
```bash
docker compose up --build -d
```

This starts three containers:

| Container       | Service | Port  |
|-----------------|---------|-------|
| `zoryvn-api`    | API     | 5000  |
| `zoryvn-mongo`  | MongoDB | 27017 |
| `zoryvn-redis`  | Redis   | 6379  |

The API waits for **MongoDB** and **Redis** to pass their health checks before starting.

### 3. Verify it's running
```bash
# Container status
docker compose ps

# API health check
curl http://localhost:5000

# Live logs
docker compose logs -f api
```

### 4. Access Swagger docs
```
http://localhost:5000/api-docs
```

---

## 🛠 Common Commands

| Task | Command |
|---|---|
| Start services | `docker compose up -d` |
| Stop services | `docker compose down` |
| Rebuild after code changes | `docker compose up --build -d` |
| View API logs | `docker compose logs -f api` |
| Open a shell in the container | `docker compose exec api sh` |
| Open Mongo shell | `docker compose exec mongo mongosh financeDB` |
| Open Redis CLI | `docker compose exec redis redis-cli` |
| Wipe all data (volumes) | `docker compose down -v` |

---

## 🗂 Project Structure

```
.
├── Dockerfile          # Multi-stage Node.js image
├── docker-compose.yml  # API + MongoDB + Redis orchestration
├── .dockerignore       # Keeps build context lean
├── .env.example        # Environment variable template
├── server.js           # Entry point
└── src/
    ├── app.js          # Express app & middleware
    ├── config/         # DB, Redis, Swagger config
    ├── middleware/      # Auth, cache, error handlers
    └── modules/        # auth | records | dashboard
```

---

## 🔐 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | API listen port | `5000` |
| `NODE_ENV` | Runtime environment | `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/financeDB` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `JWT_SECRET` | Secret for signing JWTs | *(required)* |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |

> **Note:** When running with Docker Compose the service hostnames (`mongo`, `redis`) are used automatically via the overrides in `docker-compose.yml`.
