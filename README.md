# Career Guidance Club (CGC)

CGC is a student resume-analysis demo. A student chooses a PDF resume and gets
a career-readiness score, likely roles, skill gaps, and a simple 90-day plan.

The stack is React + TypeScript on Vercel. The demo does not require sign-in,
Supabase, a database, or file storage. It reads the resume and keeps the result
only in temporary browser memory.

Nothing is saved by CGC. Refreshing the page, closing the tab, or choosing a
new file clears the resume and analysis.

## Documentation

- [Features](docs/features.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [Analysis engine](docs/analysis-engine.md)
- [Datasets](docs/datasets.md)
- [API contract](docs/api-contract.md)

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Use `npm run test`, `npm run lint`, and `npm run build` to verify the app.
