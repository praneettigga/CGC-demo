# Browser data flow

The demo has no backend API.

| Step | Browser action | Result |
| --- | --- | --- |
| Choose resume | Student selects one PDF | The file stays on the device |
| Read PDF | Browser extracts its text | Text exists only in React state |
| Analyse | Browser matches text against the demo skill list | Result exists only in React state |
| Show dashboard | React renders the result | Nothing is saved |

Accept PDF files only. Show a clear error if the file cannot be read or has no
usable text. Choosing another file or refreshing the page clears the current
result.
