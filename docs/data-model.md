# Data model

This is the proposed Postgres model, not a migration. Use UUID primary keys,
`timestamptz` timestamps, and `created_at`/`updated_at` audit fields on mutable
tables.

## Core tables

| Table | Important fields | Notes |
| --- | --- | --- |
| `profiles` | `id` (FK `auth.users`), `full_name`, `institution`, `graduation_year` | One row per student; resume content does not belong here. |
| `resumes` | `id`, `user_id`, `storage_path`, `original_filename`, `mime_type`, `file_size_bytes`, `status`, `failure_code`, `uploaded_at`, `processed_at` | One record per upload; never expose a permanent file URL. |
| `resume_extractions` | `id`, `resume_id`, `schema_version`, `extracted_json`, `provider_name`, `provider_model`, `created_at` | Private structured source data. Keep only validated JSON. |
| `analyses` | `id`, `resume_id`, `user_id`, `algorithm_version`, `knowledge_version`, `readiness_score`, `result_json`, `created_at` | Immutable dashboard snapshot; unique per `resume_id` and algorithm version. |
| `role_profiles` | `id`, `slug`, `title`, `description`, `is_active`, `version` | Club-curated target roles, e.g. backend developer. |
| `role_profile_skills` | `role_profile_id`, `skill_id`, `importance_weight`, `minimum_level` | Weighted expectation for a role. |
| `skills` | `id`, `canonical_name`, `category`, `esco_uri`, `aliases`, `is_active` | Canonical vocabulary and optional ESCO link. |
| `learning_resources` | `id`, `skill_id`, `title`, `url`, `resource_type`, `difficulty`, `is_active` | Club-approved resources used in roadmap steps. |

`result_json` contains the presentation-ready result: category scores, top
skills and evidence, ordered role matches, skill gaps, roadmap phases, and
human-readable rationale. Keeping it with version fields ensures past results
remain reproducible after role profiles change.

## Example analysis result

```json
{
  "readiness": { "score": 72, "band": "Developing", "rationale": ["Two relevant projects"] },
  "roleMatches": [{ "roleSlug": "backend-developer", "score": 81, "matchedSkills": ["Node.js", "PostgreSQL"], "gaps": ["Docker"] }],
  "skillProfile": { "frontend": 45, "backend": 78, "databases": 70, "cloud": 20, "devops": 15, "ai_ml": 10 },
  "strongestSkills": [{ "skill": "PostgreSQL", "score": 85, "evidence": ["Project: inventory system"] }],
  "recommendations": [{ "skill": "Docker", "priority": "high", "reason": "Missing in two leading roles" }],
  "roadmap": [{ "days": "1-30", "goal": "Learn Docker basics", "resources": [] }]
}
```

## Relations and lifecycle

```text
auth.users 1--1 profiles
auth.users 1--* resumes 1--0..1 resume_extractions
                         \--* analyses
role_profiles *--* skills (through role_profile_skills)
skills 1--* learning_resources
```

The storage object is linked by `resumes.storage_path`, not by a public URL.
Deleting a resume must delete its storage object and dependent extraction and
analysis records in one controlled server-side workflow.

## Indexes and constraints

- Index `resumes(user_id, uploaded_at desc)` and `analyses(user_id, created_at desc)`.
- Make `storage_path` unique; constrain MIME type to PDF and status to the four
  documented states.
- Constrain scores to `0..100`, role-skill weights to a positive bounded range,
  and canonical skill names to unique case-insensitive values.
- Store provider/model and knowledge/algorithm versions with every result, not
  only in configuration.

## Access model

All `public` tables have RLS enabled. Authenticated users can select and manage
only rows whose `user_id = auth.uid()`; they cannot insert a completed analysis
or alter a role profile. Canonical skills, active role profiles, and active
resources may be readable by authenticated users, but are written only by an
admin workflow. The Edge Function verifies ownership independently before
performing analysis.
