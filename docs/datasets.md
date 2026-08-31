# Datasets and content governance

## Recommended starting source

Use the European Commission's ESCO skills and occupations data as the initial
vocabulary and occupation reference. Import only the fields needed for CGC:
skill label, aliases, skill URI, occupation label, and relationships. Keep the
source version and licence/attribution with the import script and in the admin
documentation.

ESCO is a starting point, not the product's final recommendation system. A
club-curated layer maps broad ESCO terms to the six dashboard categories,
chooses a practical set of student-facing roles, sets weights, and chooses
learning resources. This keeps results useful for the club's curriculum.

## Seed scope for v1

- 6–10 target roles, such as frontend developer, backend developer, full-stack
  developer, data analyst, cloud engineer, and QA engineer.
- About 80–150 canonical technical skills with aliases (for example, `JS` and
  `JavaScript` map to one skill).
- 3–8 weighted skills per role, including a mix of foundational and advanced
  skills.
- A small, reviewed resource catalog; do not present search-engine results as
  endorsed learning material.

## Import and review process

1. Keep raw downloaded source files outside browser-accessible assets.
2. Run a repeatable import/normalization script that produces seed data.
3. A club admin reviews aliases, categories, role weights, and resource links.
4. Publish a new `knowledge_version` when the curated data changes.
5. Keep prior versions so existing analysis snapshots remain interpretable.

Never use personal resumes to create a dataset, train a model, or improve a
provider without the student’s explicit, separate opt-in.
