# Leaky Bucket Rate Limiter

A multi-tenant rate limiting service built with Elysia and Bun, implementing a leaky bucket algorithm with Redis persistence.

## 🔥 Core Features

- **Multi-tenancy**: Each user gets their own leaky bucket
- **Bearer Token Authentication**: Simple token validation
- **Token Management**:
  - Decreases by 1 on every request
  - Permanently removed on failed requests (status !== 200)
  - Replenished 1 per hour, capped at 10 tokens max

## 🏗️ Architecture

- **Framework**: Elysia with Bun runtime
- **Database**: Redis for bucket state persistence
- **Queue**: BullMQ for scheduled token refills
- **Rate Limiting**: Leaky bucket algorithm per user

## 🚀 Getting Started

### Development

```bash
docker compose up -d

docker exec api sh
```

Open http://localhost:3000/ to see the API.

## 📖 API Usage

### Rate Limiting Behavior
- Each request consumes 1 token
- Failed requests (non-200 status) permanently remove tokens
- Tokens are automatically replenished at 1 per hour
- Maximum bucket capacity: [10 tokens](https://github.com/RyanGst/leaky-bucket/blob/e9b58e8b397e69f3a344423bb1a8645545fd4cec/src/utils/constants.ts)

