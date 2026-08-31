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
| Resume builder | React state and live HTML preview |
| PDF generation | Vercel function + signed Cloud Run LaTeX compiler |

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

The builder draft also stays in React state. Only a deliberate PDF request sends
the structured draft to the same-origin Vercel function. That function signs the
exact JSON body and forwards it to Cloud Run. The compiler validates the model,
escapes all text into the fixed Jake template, returns the PDF, and removes its
temporary working directory.

## Important rules

- Do not add sign-in, a database, or cloud Storage for this demo.
- Do not save resume text, the PDF, or analysis results anywhere.
- Use browser-only rules for resume analysis, so uploaded resume data does not
  leave the student's device.
- Send builder data only for an explicit PDF request; never log or persist it.
