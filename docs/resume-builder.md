# Jake's Resume builder

## Student flow

1. Open **Resume templates** and choose **Build with this template** on Jake's
   Resume.
2. Complete contact, education, experience, projects, technical skills, and any
   custom sections.
3. Review the live single-column preview and any likely one-page overflow
   warning.
4. Choose **Download PDF**. CGC validates the draft, compiles it temporarily,
   and downloads the result.

The builder includes add, remove, and reorder controls. Experience, project,
and custom-section bullets include action-and-result writing guidance. It does
not rewrite student content with AI.

## Privacy and security

The editable draft stays only in React state and disappears on refresh or tab
close. CGC sends the structured draft only after the student requests a PDF.

```text
Browser -> same-origin Vercel function -> signed Cloud Run request -> PDF
```

- Neither service writes resume data to a database, Storage, logs, analytics,
  localStorage, or sessionStorage.
- Cloud Run compiles inside a unique temporary directory and removes it in a
  `finally` cleanup path.
- The compiler accepts structured JSON only. It uses a fixed Jake template,
  escapes LaTeX control characters, and disables shell escape.
- Requests are limited to 64 KB, five best-effort requests per minute per
  address at the proxy, 12 seconds of compilation, and bounded Cloud Run
  instances/concurrency. Configure a platform-level Vercel rate-limit rule for
  stronger distributed enforcement.
- Compiler responses use `no-store`; application logs must never include the
  request body or generated LaTeX.

## Deployment

Deploy `compiler/` to Cloud Run using its Dockerfile. Configure these server-only
variables in Vercel; never prefix them with `VITE_`:

| Variable | Purpose |
| --- | --- |
| `COMPILER_URL` | HTTPS URL of the Cloud Run service |
| `COMPILER_SIGNING_SECRET` | Shared high-entropy HMAC secret |

Use the same secret in Cloud Run. Set the Vercel project root to `frontend` and
deploy after the Cloud Run health endpoint returns `200`.

## Attribution

The generated source preserves Jake Gutierrez's author attribution, the
original `sb2nov/resume` reference, and the supplied MIT license notice.
