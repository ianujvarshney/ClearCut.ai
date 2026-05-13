# ClearCut AI Engine, Infrastructure, and Production Deployment

## Runtime Architecture

ClearCut AI is split into independently scalable services:

- API Gateway: Express/TypeScript REST API, auth, upload validation, rate limits, OpenAPI docs, Bull Board, and signed download URLs.
- WebSocket service: Socket.IO channel for live processing progress, queue status, ETA, and dashboard events.
- Image worker: BullMQ consumer for AI background removal with retry and fallback handling.
- Media worker: image optimization, thumbnail generation, lifecycle cleanup, and post-processing events.
- AI inference service: FastAPI/Python microservice designed for GPU nodes and model routing across U2Net, RMBG, MODNet, and ONNX U2Net.
- Data plane: MongoDB for users/images/jobs, Redis for queues/events/cache, object storage for originals/results, CDN for delivery.

## AI Pipeline

1. The API accepts a secure image upload through memory-backed Multer validation.
2. `ObjectStorageService` stores the original object and returns a CDN/object URL.
3. `ImageService.enqueue` creates a `ProcessingJob` and submits BullMQ work with model, background, and priority metadata.
4. `image.worker` marks the job processing and calls the `FallbackBackgroundProvider`.
5. The provider chain tries `fastapi`, then ClipDrop-style external API, then mock fallback for local/dev resilience.
6. The worker stores the result on the `Image` record and enqueues optimization and thumbnail jobs.
7. Processing events are published on Redis and delivered to WebSocket rooms as `processing:update`.
8. Downloads are returned through signed short-lived URLs.

## Provider Strategy

Provider order is controlled by `AI_PROVIDER_ORDER`, for example:

```text
AI_PROVIDER_ORDER=fastapi,clipdrop,mock
```

Supported provider targets:

- `fastapi`: first-party Python inference service.
- `clipdrop`: hosted remove-background API compatible integration.
- `mock`: deterministic development provider for local workflows and tests.

The Python service exposes `/v1/remove-background` and is structured to mount model weights in `/models`. Production model implementation should route:

- U2Net for general object/person segmentation.
- RMBG for fast high-quality product cutouts.
- MODNet for human portrait/video-matte style edges.
- ONNX U2Net for CPU or optimized inference pools.

## Queue Topology

- `image-processing`: AI background removal jobs.
- `image-optimization`: PNG/WebP/JPEG optimization.
- `thumbnail-generation`: dashboard and history previews.
- `storage-cleanup`: temporary object lifecycle cleanup.

BullMQ uses exponential backoff, three attempts for AI jobs, and a separate failed-job retention window for inspection through `/admin/queues`.

## Cloud Storage and CDN

The storage abstraction supports local, S3, GCS, Azure, and Cloudinary deployment modes through environment configuration. Production should use:

- Private original object bucket.
- Public or signed result bucket behind CloudFront.
- Lifecycle rules for temporary uploads older than `TEMP_OBJECT_TTL_HOURS`.
- CDN cache policies keyed by immutable object path.
- Short-lived signed URLs controlled by `SIGNED_URL_TTL_SECONDS`.

## Security

The backend includes Helmet, CORS allowlists, HPP protection, Mongo sanitization, XSS cleaning, cookie signing, global rate limiting, JWT auth, API key flows, secure upload type/size limits, and internal AI service JWT auth. Production should place WAF/DDoS protection in front of the ingress or CloudFront distribution and enable malware scanning before AI inference when `MALWARE_SCAN_ENABLED=true`.

## Observability

- `/health`: API health probe.
- `/metrics`: Prometheus text metrics for API uptime and queue counts.
- `/admin/queues`: Bull Board queue monitoring.
- Pino logs: structured request and worker logs.
- Prometheus/Grafana: service, queue, CPU, memory, and GPU dashboards.
- Kubernetes probes: liveness/readiness for API and AI inference.

## Deployment

Local:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Observability profile:

```bash
docker compose --profile observability up --build
```

Kubernetes:

```bash
cd backend
sh infra/scripts/deploy.sh staging
```

Rollback:

```bash
cd backend
sh infra/scripts/rollback.sh
```

## Production Hardening Checklist

- Replace placeholder image names in `infra/k8s/*.yaml`.
- Store secrets in Kubernetes secrets or a managed secret store.
- Use managed MongoDB, managed Redis, and S3/GCS/Azure object storage.
- Attach GPU node groups and NVIDIA device plugin for inference pods.
- Configure CloudFront or equivalent CDN with WAF, cache policies, and signed URL behavior.
- Add queue-depth based autoscaling with KEDA for image workers.
- Add real malware scanning service before queue submission.
- Add full model implementation in `ai-service/app/main.py` and mount model weights.
