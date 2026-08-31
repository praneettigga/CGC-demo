# API contract

The React app uses Supabase client APIs for Auth, Storage, and read-only
student-owned data. It calls one Edge Function for privileged analysis.

## Client operations

| Operation | Method | Contract |
| --- | --- | --- |
| Upload resume | Storage upload + insert `resumes` | Private path `user-id/resume-id/original.pdf`; status `uploaded` |
| Start analysis | `POST /functions/v1/analyse-resume` | Body `{ "resumeId": "uuid" }`; authenticated JWT required |
| Check status | Select owned `resumes` record | Show queued/processing/completed/failed state |
| Display results | Select owned latest `analyses` record | Render stored result JSON; never recalculate client-side |
| Delete | Controlled delete workflow | Deletes database records and storage object after ownership check |

## Analyse-resume response

```json
{ "resumeId": "uuid", "status": "processing" }
```

The function returns `400` for invalid input, `401` for no valid session, `403`
for a resume not owned by the caller, `409` when analysis is already running,
and `429` when rate-limited. It returns a generic safe `500` error while the
database retains an internal failure code for support.

## Idempotency

One active analysis per resume is allowed. Repeating a request while status is
`processing` returns the existing state; a completed resume is not re-billed or
reanalysed unless the student explicitly chooses “analyse again”.
