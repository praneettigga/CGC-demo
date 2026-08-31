# Career Guidance Club (CGC)

CGC is a student resume-analysis and resume-building demo. A student can analyse
an existing PDF or complete structured fields to generate Jake's Resume as a
polished PDF.

The frontend is React + TypeScript on Vercel. Analysis and PDF generation stay
in the browser. The demo does not require sign-in, Supabase, a backend, a
database, or file storage.

Nothing is saved or transmitted by CGC. Builder data is used only in the
browser to create the downloaded PDF.

## Documentation

- [Features](docs/features.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Analysis engine](docs/analysis-engine.md)
- [Datasets](docs/datasets.md)
- [API contract](docs/api-contract.md)
- [Jake's Resume builder](docs/resume-builder.md)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Use `npm run test`, `npm run lint`, and `npm run build` to verify the app.
Run all three checks together with `npm run check`.

## Vercel setup

Create the Vercel project with `frontend` as its Root Directory. No environment
variables or backend service are required for PDF downloads.
