# Temporary app state

The demo has no database or stored user data. React keeps the current resume
and result in memory only.

| State | Example | Lifetime |
| --- | --- | --- |
| `selectedFile` | The chosen PDF file | Until another file is chosen or the page closes |
| `resumeText` | Extracted PDF text | Until another file is chosen or the page closes |
| `analysis` | Score, role matches, and roadmap | Until another file is chosen or the page closes |
| `error` | "This PDF has no readable text" | Until the next attempt |
| `resumeDraft` | Builder contact, sections, entries, and bullets | Until refresh or tab close |
| `generationError` | PDF validation or generation message | Until the next generation attempt |

Do not use Supabase, a database, localStorage, sessionStorage, cookies, or
analytics to keep resume-related information. The page starts empty after a
refresh.

The builder uses `resumeDraft` only in the browser to generate the downloaded
PDF. It is never sent to a server.
