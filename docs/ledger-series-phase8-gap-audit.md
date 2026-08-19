# Ledger Series Phase 8 — Current Main Gap Audit

Date: 2026-08-19  
Repository: `badjoke-lab/api-deprecation-archive`  
Audited main: `c86b1011f9cbea642b311ed97bb8e718427da02f`

## Authority boundary

This audit starts from current reviewed `main`. It does not treat chat history, stale PR descriptions, `data/records.json`, or old staging bundles as canonical authority when they disagree with the schema-validated entity/event/evidence files.

Required authorities:

- `docs/spec/api-deprecation-archive-v0.1-spec.md`
- `docs/data-schema.md`
- `docs/status-definitions.md`
- `docs/methodology.md`
- `docs/source-policy.md`
- `docs/ai-era-registry-spec.md`
- `docs/ai-era-execution-schedule.md`
- current JSON schemas and validation logic

## Current repository state

### Existing public product surfaces

The v0 public preview already provides substantial lifecycle navigation and must be reused rather than rebuilt from zero:

- `/apis/` searchable/filterable list;
- API detail pages for the 20 display seed records;
- `/deadlines/`;
- `/deprecated/`;
- `/removed/`;
- `/replacements/` replacement matrix;
- `/providers/` and current provider detail coverage;
- `/timeline/`;
- `/release/`;
- robots/sitemap/canonical/OG/JSON-LD SEO basics.

### Display layer

`data/records.json` and `data/timeline.json` contain the 20-record v0 display seed.

The current API-list client provides:

- text search;
- category filter;
- lifecycle stage filter;
- production-risk filter;
- query-string persistence for `q` only.

This is useful public UI but is not yet the deterministic migration-history filter surface required by the AI-era spec.

### Canonical validated layer

The validator treats these directories as the canonical typed registry:

- `data/entities/`
- `data/events/`
- `data/evidence/`
- `data/providers/`

At the audit point, `data/entities/` contains only five real entity JSON files plus `.gitkeep`, while the public display seed contains 20 records.

Therefore the repository has a critical authority split:

```text
20 display records
vs
5 schema-validated canonical entity records
```

The same backfill problem applies to the corresponding canonical lifecycle events/evidence needed for the remaining display records.

## Open PR audit

One PR is open:

- PR #22
- title: `placeholder`
- draft: true
- base SHA: `e16da9fa856674b7c166c45c3203baa5c0abc65a`
- head: `canonical-json-backfill-pr-019`
- head SHA: `4f54f4c8b8e5ca91620567f027b0b27faf35086b`

It adds only two aggregate files:

- `data/canonical/seed-records-v0.json`
- `data/canonical/seed-v0-bundle.json`

Those bundles are historically useful as a backfill reference, but they are not the current per-file canonical model consumed by `scripts/validate-data.mjs`. They also predate the merged AI-era specification/schedule.

Decision:

- do not merge PR #22 wholesale;
- preserve it as reference history until Stage 2 rebuilds the missing canonical records;
- reuse IDs/facts only after mapping them into the current schema and source policy;
- once Stage 2 supersedes it, close #22 with an explicit supersession note.

## AI-era gap map

### Stage 1 — current-main audit

Required by this document. No canonical mutation.

### Stage 2 — canonical backfill and schema gate

This is the first implementation prerequisite.

Required outcome:

- reconcile all 20 public display seed records with schema-validated canonical entity/event/evidence records;
- preserve existing IDs where they are already reviewed and collision-free;
- validate dates, status, deadline state, replacement claims and source scope against v0.1 rules/current first-party evidence where needed;
- do not copy weak `production_risk`, `still_usable`, replacement or deadline claims blindly from the display manifest;
- decide whether the current schema can represent migration-window/replacement facts without extension.

No later deterministic public layer should use the lightweight display manifest as the canonical source of truth.

### Stage 3 — deterministic per-API JSON

Missing.

Required after Stage 2:

- canonical per-API machine JSON;
- index/manifest/version discovery;
- validator that checks exact file-set and canonical projection;
- no unreviewed candidate inclusion.

### Stage 4 — structured migration filters

Existing filters are partial.

Verified missing/partial dimensions include:

- provider;
- API/record type;
- deprecation/effective dates;
- migration-window length or availability where canonical dates support it;
- replacement availability/type;
- still-usable/action-required dimensions where current canonical data supports them;
- evidence/source quality;
- deterministic URL state for all filters, not only `q`.

### Stage 5 — migration-history Compare

Missing.

Required shape:

- bounded comparison set;
- migration/deprecation/shutdown dates and window facts;
- replacement facts only when canonical;
- source/confidence/review provenance;
- no vendor score or ranking.

### Stage 6 — migration and quality Stats

Missing as a dedicated canonical analysis surface.

Required dimensions from the AI-era spec:

- migration-window distributions;
- deprecation/removal reasons or event patterns where represented;
- replacement availability/type;
- provider patterns;
- lifecycle-stage distribution;
- source/evidence/freshness/coverage quality.

### Stage 7 — reviewed follow-up and production verification

Required after deterministic surfaces stabilize.

The repository contains multiple future/current lifecycle boundaries, so follow-up must distinguish announced deadlines from confirmed removal. Production verification must be read-only and tied to reviewed repository state.

### Stage 8 — closeout

Authority/status/roadmap sync after all bounded stages and production evidence are complete.

## Explicit non-goals

Phase 8 does not authorize:

- AI-generated canonical dates or replacement paths;
- using display-manifest risk labels as objective vendor rankings;
- automatically marking an API removed because a deadline passed;
- chatbot-first replacement of deterministic search;
- unreviewed candidate publication.

## Next action after Stage 1 merge

Stage 2 must rebuild the canonical 20-record baseline in schema-validated per-file form, using PR #22 only as a reference input rather than a merge target.
