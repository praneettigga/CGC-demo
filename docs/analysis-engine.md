# Analysis engine

## Principle

AI is used only as an extraction and normalization assistant. Scores and
recommendations are deterministic, versioned, and explainable from stored
resume evidence plus role-profile data. CGC does not train a model or infer
protected characteristics.

## Input contract

The validated extraction schema contains `skills`, `education`, `projects`,
`experience`, and `certifications`. Each skill has a canonical id after alias
normalization and zero or more evidence references (project, experience, or
certification). Unknown skills are retained as text for review but do not gain
an arbitrary category score.

## Score calculation

All component scores are clamped to 0–100. Start with transparent weights and
adjust them only by releasing a new `algorithm_version`:

| Component | Weight | Evidence |
| --- | ---: | --- |
| Relevant skills | 40% | Coverage and importance against the student's best-matching roles |
| Projects | 25% | Complete, relevant projects with described contribution/outcome |
| Experience | 20% | Relevant internships, work, or substantial responsibility |
| Certifications / education | 10% | Relevant verified or clearly stated credentials |
| Resume quality | 5% | Parsable sections and specific evidence; never grammar or writing style alone |

`readiness_score = round(sum(component_score * weight))`. The dashboard shows
the component explanations so a score never appears as unexplained AI output.

## Role matching

For each active role, calculate weighted coverage:

```text
role_match = 100 * sum(weight of matched required skills) / sum(all required skill weights)
```

Add a small, capped evidence bonus (maximum five points) when a matching skill
is supported by a relevant project, experience, or certification. Return the
top three roles and list the highest-impact missing skills. Do not claim that a
percentage is a hiring probability; it is a profile-to-role fit indicator.

## Skill profile and strongest skills

Map canonical skills into six categories: frontend, backend, databases, cloud,
DevOps, and AI/ML. A category score is weighted evidence coverage, normalized
to 0–100 for the radar chart. A strongest-skill score combines role importance
and evidence count/type, then returns the top five with proof links to the
parsed resume sections.

## Recommendations and roadmap

Rank missing skills by: (1) importance in the student’s top roles, (2) number
of top roles affected, and (3) prerequisite order. Recommend no more than
three high-impact skills at a time. Create a realistic 90-day roadmap:

- Days 1–30: one foundation skill plus a small exercise.
- Days 31–60: apply it in a portfolio project or feature.
- Days 61–90: polish, document, deploy, and update the resume.

Each step points to a curated `learning_resources` record where available. The
result says “suggested next steps”, not a guarantee of employment.

## Quality controls

- Validate provider JSON against a server-side schema; reject missing or
  fabricated URLs, dates, and credentials.
- Maintain a small club-reviewed set of sample resumes and expected results.
- Test boundary cases: empty resume, image-only PDF, duplicate skills,
  unrelated skills, and no matching role.
- Log algorithm and knowledge versions; reanalyse only on a deliberate student
  request or released scoring version.
