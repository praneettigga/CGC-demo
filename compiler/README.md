# CGC resume compiler

This service accepts CGC's structured resume JSON and compiles it with a fixed,
attributed copy of Jake's Resume. It never accepts raw LaTeX. Every student
value is validated and escaped before template interpolation.

## Local verification

```bash
npm test
docker build -t cgc-resume-compiler .
```

The container requires `COMPILER_SIGNING_SECRET` and listens on `PORT` (8080 by
default). `GET /health` is public. `POST /compile` requires `application/json`,
`x-cgc-timestamp`, and `x-cgc-signature`. The signature is a SHA-256 HMAC over
`<timestamp>.<exact request body>`.

Compilation runs with shell escape disabled, a 12-second timeout, a 64 KB
request limit, and a new temporary directory for every request. The directory
is deleted whether compilation succeeds or fails.

## Google Cloud Run

Create one Secret Manager secret containing the signing secret, then deploy
from the repository root:

```bash
gcloud run deploy cgc-resume-compiler \
  --source compiler \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-secrets COMPILER_SIGNING_SECRET=cgc-resume-compiler-signing:latest \
  --memory 1Gi \
  --cpu 1 \
  --timeout 20 \
  --concurrency 4 \
  --max-instances 3
```

The endpoint is publicly reachable because Vercel must call it, but unsigned,
expired, or modified requests are rejected before validation or compilation.
Configure the same secret and the resulting Cloud Run URL as server-only Vercel
environment variables.
