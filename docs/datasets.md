# Engineering career dataset

CGC ships a reviewed local subset of occupation and skill data. The browser does
not download a dataset or call an external API while analysing a resume.

## Sources and versioning

- **ESCO 1.2.1** supplies the occupation-to-skill structure and skill
  vocabulary. See the [official ESCO download page](https://esco.ec.europa.eu/en/use-esco/download).
- **O*NET 31.0** improves tool names and common technology aliases. See the
  [official O*NET database page](https://www.onetcenter.org/database.html).

The exact local release and review date are exported as `knowledgeVersion` and
`knowledgeReviewedOn` from
`frontend/src/data/careerData.ts`. That file also records the source versions,
source links, engineering categories, skills, aliases, and role profiles.

## Coverage

The current release contains 35 entry-level roles across software, data and AI,
cloud and DevOps, security and networks, electronics and electrical,
mechanical and manufacturing, civil and construction, chemical and process,
and engineering design.

Each role lists essential and supporting skills, plus terms that can provide
small additional evidence from relevant projects, coursework, and degree
subjects. Essential skills receive more weight than supporting tools.

## Matching safeguards

CGC recognises safe aliases locally. Short ambiguous terms such as `C`, `CAD`,
and `PLC` must appear near a resume-relevant context such as Skills, Tools,
Projects, or Coursework. This reduces accidental matches in ordinary prose.

Role matches are profile-fit guidance only. They are not hiring probabilities,
do not assess potential, and never use student resumes to train a model.

## Updating the dataset

Update the curated TypeScript list through a reviewed code change. Record the
new source version, review date, and `knowledgeVersion`, and add synthetic test
resumes for every newly covered discipline or role family. Do not replace the
local subset with a full runtime import: predictable browser performance and
private analysis are intentional product constraints.
