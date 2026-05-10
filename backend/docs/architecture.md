# Backend Architecture

ClearCut AI uses modular clean architecture:

1. Controllers handle HTTP concerns only.
2. Validators parse and constrain input with Zod.
3. Services own business workflows and orchestration.
4. Repositories isolate database access.
5. Models define Mongoose schemas and indexes.
6. Queues isolate slow AI processing from request latency.
7. Workers process image jobs independently and can scale horizontally.

The structure is microservice-ready: auth, image processing, billing, and developer API modules can later move into separate deployable services while keeping contracts stable.

## Security Layers

- Helmet secure headers
- CORS allowlist
- Global rate limiting
- Mongo sanitization
- XSS cleaning
- HPP protection
- JWT access tokens
- Refresh-token session model
- RBAC middleware
- API key hashing
- Upload type and size validation
- Audit/activity log model

## Scaling Strategy

- API nodes are stateless.
- Refresh sessions live in MongoDB.
- Queue state and rate-limit state live in Redis.
- Image work runs in BullMQ workers.
- Processed assets should be stored in Cloudinary or S3 behind a CDN.
- PM2 cluster mode or containers can scale API horizontally.
