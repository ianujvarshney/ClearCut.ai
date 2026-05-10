# ClearCut AI Backend

Production-grade Node.js, Express, TypeScript, MongoDB, and Redis backend for an AI background remover SaaS.

## Architecture

- `src/modules/*`: clean feature modules with controllers, services, repositories, validators, and routes.
- `src/models`: optimized Mongoose collections for users, sessions, RBAC, images, uploads, jobs, billing, credits, API keys, notifications, activity logs, analytics, content, and FAQs.
- `src/middlewares`: auth, RBAC, API keys, validation, uploads, security, centralized errors.
- `src/queues` and `src/workers`: BullMQ image-processing queue and worker.
- `src/configs`: environment validation, MongoDB, Redis, Stripe, Cloudinary, Swagger, logging.
- `docs`: OpenAPI extension files and architecture notes.
- `nginx`, `Dockerfile`, `docker-compose.yml`, `ecosystem.config.js`: deployment-ready setup.

## Local Development

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Run infrastructure:

```bash
docker compose up mongo redis
```

Run worker:

```bash
npm run worker
```

## Important Endpoints

- `GET /health`
- `GET /docs`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/images/upload`
- `POST /api/v1/images/remove-background`
- `GET /api/v1/dashboard/overview`
- `POST /api/v1/billing/checkout`
- `GET /api/v1/admin/analytics`
- `POST /api/v1/public/remove-background` with `x-api-key`
- `GET /admin/queues`

## Production Notes

- Replace mock AI provider with a provider implementation in `modules/images/services/ai-provider.service.ts`.
- Connect Cloudinary or S3 in the upload service.
- Add Stripe webhook signature verification before enabling live billing.
- Use strong secrets and managed Redis/MongoDB in production.
- Run API and workers as separate processes for horizontal scaling.
