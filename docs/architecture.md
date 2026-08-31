# Architecture

## Goal

For the demo, a student chooses one PDF resume and sees a dashboard with a
score, role matches, skill gaps, and a 90-day plan. There is no sign-in.

## Stack

| Part | Tool |
| --- | --- |
| Frontend | React + TypeScript (Vite) |
| Hosting | Vercel |
| Resume reading | PDF text extraction in the browser |
| Analysis | Simple rules in the browser |

## Flow

```text
Student → Choose PDF → Read text in browser → Analyse → Dashboard
```

1. The student chooses a PDF from their device.
2. The browser reads its text and finds recognised skills, projects, education,
   and experience.
3. The browser calculates the result using the small role and skill list.
4. The dashboard displays that result immediately.

The PDF text and dashboard result are kept only in React state. They are not
sent to a database, uploaded to Storage, or saved in localStorage/sessionStorage.
They disappear when the page refreshes, the tab closes, or a new resume is chosen.

## Important rules

- Do not add sign-in, a database, cloud Storage, or an API for this demo.
- Do not save resume text, the PDF, or analysis results anywhere.
- Use browser-only rules rather than an AI provider, so resume data does not
  leave the student's device.
