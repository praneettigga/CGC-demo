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

# Resume PDF generation

The resume builder validates the in-memory `ResumeDraft` before creating a
standard PDF Blob directly in the browser. Full name, a valid email, and at
least one complete resume section are required. No PDF-generation API exists,
and the draft is never transmitted.
