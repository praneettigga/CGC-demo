# Resume analysis data flow

The resume-analysis flow has no backend API.

| Step | Browser action | Result |
| --- | --- | --- |
| Choose resume | Student selects one PDF | The file stays on the device |
| Read PDF | Browser extracts its text | Text exists only in React state |
| Analyse | Browser matches text against the demo skill list | Result exists only in React state |
| Show dashboard | React renders the result | Nothing is saved |

Accept PDF files only. Show a clear error if the file cannot be read or has no
usable text. Choosing another file or refreshing the page clears the current
result.

# Resume PDF API

`POST /api/resume-pdf` accepts the in-memory `ResumeDraft` JSON model. Full name,
a valid email, and at least one complete resume section are required. The
request supports up to 6 education entries, 8 experience entries, 8 projects,
8 skill groups, 6 custom sections, 8 bullets per entry, 40 bullets total, and a
64 KB encoded body.

Successful responses use `application/pdf`, `Content-Disposition: attachment`,
and `Cache-Control: no-store`. Errors are JSON:

| Status | Error | Meaning |
| --- | --- | --- |
| 413 | `PAYLOAD_TOO_LARGE` | Request exceeds 64 KB |
| 422 | `INVALID_RESUME` | Structured validation failed; `details` lists safe messages |
| 429 | `RATE_LIMITED` | Too many recent proxy requests |
| 503 | `COMPILER_UNAVAILABLE` | Configuration, network, or compiler service unavailable |

The browser never sends raw LaTeX. The Vercel function signs the exact forwarded
body; Cloud Run rejects missing, modified, or older-than-60-second signatures.
