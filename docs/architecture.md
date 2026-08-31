# Architecture

## Purpose

Career Guidance Club (CGC) helps a signed-in student upload a resume and receive
an explainable career-readiness assessment, role matches, skill profile, skill
gaps, and a 90-day roadmap. Version 1 is a small web application: it does not
train, host, or fine-tune a machine-learning model.

## Chosen stack

| Area | Choice | Responsibility |
| --- | --- | --- |
| Web app | React + TypeScript (Vite recommended) | Student interface and charts |
| Hosting | Vercel | Deploy the static React build and environment configuration |
| Backend | Supabase | Auth, Postgres, private file storage, and Edge Functions |
| Resume extraction | Managed AI/document-parsing API, called only from an Edge Function | Convert resume text into schema-validated structured data |
| Career knowledge | Versioned curated role profiles, seeded from ESCO and club-reviewed mappings | Role skills, categories, weights, and learning resources |

Do not put an AI-provider key or a Supabase secret/service key in the React
application. The browser uses only the Supabase publishable key.

## System diagram

```text
Student browser (React on Vercel)
   | sign in, upload, poll status, display dashboard
   v
Supabase Auth / PostgREST / private Storage
   | resume record and private PDF
   v
analyse-resume Edge Function (authenticated)
   | validates ownership, extracts text, calls provider using a server secret
   v
Structured extraction -> deterministic scoring -> Postgres analysis snapshot
   ^                                                    |
   |                     dashboard query                v
React charts <---------------------------------- analysis + roadmap data
```

## Processing flow

1. A student signs in with Supabase Auth and uploads one PDF to the private
   `resumes` bucket at `user-id/resume-id/original.pdf`.
2. The client creates a `resumes` record with status `uploaded`, then invokes
   `analyse-resume` with that record id. The function verifies the caller owns
   the record before doing any privileged work.
3. The function validates PDF type and size, obtains the file internally,
   extracts text, and sends only the necessary text to the selected provider.
4. Provider output must conform to a strict JSON schema. Invalid output is
   rejected or retried once; raw model prose is never displayed as data.
5. The function normalizes skills against the canonical skill catalog and runs
   the rules in `analysis-engine.md`. It writes an immutable analysis snapshot
   and marks the resume `completed` or `failed`.
6. The dashboard reads only the student's own completed snapshots. A later
   upload makes a new resume and analysis; it never silently overwrites history.

Use status polling for v1 (`uploaded`, `processing`, `completed`, `failed`).
Realtime can be added later without changing the data contract.

## Boundaries and responsibilities

### React application

Owns pages, client-side file preflight, upload progress, authenticated calls,
and visualisation. It must not calculate authoritative scores, parse sensitive
resume content with a third-party browser SDK, or trust a role supplied by the
client.

### Supabase database and Storage

Postgres is the source of truth. The `resumes` bucket is private; students use
their JWT or a short-lived signed URL for their own file. RLS and explicit
least-privilege grants protect every exposed table.

### Edge Function

The function is the trust boundary for provider credentials and analysis logic.
It accepts an authenticated user JWT, checks record ownership, rate-limits
requests, records a safe error message, and uses a service key only for the
minimum internal work that cannot be done through RLS.

## Scale and evolution

This architecture is sufficient for a club launch with asynchronous analysis.
If extraction becomes slower than an Edge Function invocation permits, keep the
same database contract and move only the worker to a queue-backed service. Add
live job listings and job-description comparison as separate future modules;
they are intentionally outside v1.
