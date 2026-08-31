# Analysis engine

The browser extracts readable text from the PDF and uses simple fixed rules to
find skills, projects, education, and experience. The app does not send the
resume to an AI provider, train an AI model, or make hiring decisions.

## Simple scoring

Start with a score of 0:

- Add points for recognised skills.
- Add points for projects, internships, or relevant experience.
- Add a small amount for relevant education or certifications.
- Keep the final score between 0 and 100.

Show a short reason with the score, such as “Good backend skills and two
projects; add Docker and cloud deployment experience.”

## Role matches

Each role has a short list of required skills.

```text
role match = matched role skills / total role skills × 100
```

Show the best three roles and the missing skills for each role. A match score is
only a profile-fit indicator, not a hiring probability.

## Dashboard data

- Group matched skills into frontend, backend, databases, cloud, DevOps, and AI/ML.
- Show the five strongest recognised skills.
- Recommend up to three missing skills.
- Make a simple roadmap: learn, build a small project, then polish and deploy it.

If PDF reading fails or no skills are found, show a clear message and let the
student try another PDF. Keep all extracted text and analysis only in temporary
React state.
