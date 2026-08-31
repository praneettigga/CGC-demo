# Career Guidance Club (CGC)

CGC is a student resume-analysis and resume-building demo. A student can analyse
an existing PDF or complete structured fields to generate Jake's Resume as a
polished PDF.

The frontend is React + TypeScript on Vercel. Analysis stays in the browser. PDF
generation uses a same-origin Vercel function and a signed, containerized LaTeX
compiler on Google Cloud Run. The demo does not require sign-in, Supabase, a
database, or file storage.

Nothing is saved by CGC. Builder data is transmitted only when generating a PDF
and is deleted with the compiler's temporary working directory.

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

Create the Vercel project with `frontend` as its Root Directory. For PDF
generation, deploy `compiler/` to Cloud Run and set `COMPILER_URL` and
`COMPILER_SIGNING_SECRET` as server-only Vercel variables. See the resume-builder
document and `compiler/README.md` for the deployment contract.
