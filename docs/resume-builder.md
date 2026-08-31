# Jake's Resume builder

## Student flow

1. Open **Resume templates** and choose **Build with this template** on Jake's
   Resume.
2. Complete contact, education, experience, projects, technical skills, and any
   custom sections.
3. Review the live single-column preview and any likely one-page overflow
   warning.
4. Choose **Download PDF**. CGC validates the draft, creates the PDF in the
   browser, and downloads the result.

The builder includes add, remove, and reorder controls. Experience, project,
and custom-section bullets include action-and-result writing guidance. It does
not rewrite student content with AI.

## Privacy and security

The editable draft stays only in React state and disappears on refresh or tab
close. CGC does not send the structured draft anywhere.

```text
Browser -> PDF -> Download
```

- CGC does not write resume data to a database, Storage, logs, analytics,
  localStorage, or sessionStorage.
- The browser creates a standard PDF using built-in PDF fonts; no draft data
  leaves the device during generation.

## Deployment

Set the Vercel project root to `frontend` and deploy. No environment variables,
Cloud Run service, or other backend are required.

## Attribution

The generated source preserves Jake Gutierrez's author attribution, the
original `sb2nov/resume` reference, and the supplied MIT license notice.
