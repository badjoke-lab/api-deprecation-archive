# Current Status

Last updated: 2026-08-20

## Current phase

Ledger Series Phase 8 — Stage 3: per-API machine-readable JSON.

## Current reviewed state

- Public display rows: 20
- Schema-validated canonical entities: 19
- Canonical lifecycle events: 17
- Canonical evidence records: 19
- Explicit noncanonical display placeholder: 1 (`meta-graph-api-older-versions`)
- Current accepted Stage 2 main: `2bdbe2fd1ad125d013ffec5329bc802ba57b66f2`

The Meta placeholder is intentionally not counted as canonical. `older versions` is not a stable API-version entity boundary, and version-specific first-party lifecycle evidence has not yet been recovered at the quality required for canonical acceptance.

## Ledger Series Phase 8 completed work

### Stage 1 — current-main gap audit

Completed.

- Re-read the v0.1 specification, schemas, methodology, source policy, AI-era registry spec, and AI-era schedule.
- Confirmed that the public display seed had 20 rows while the schema-validated canonical layer had only five entities.
- Added the first repository validation workflow.
- Established the fixed Phase 8 stage order and fail-closed canonical boundary.

### Stage 2 — canonical backfill and schema gate

Completed with one explicit primary-evidence gap.

Reviewed canonical backfill PRs:

- PR #25 — records 6–10
- PR #26 — records 11–15
- PR #27 — records 16–20

Result:

- 19 canonical entities accepted
- 17 dated lifecycle events accepted
- 19 first-party evidence records accepted
- no schema expansion required
- multiple stale display facts corrected against current first-party evidence
- review/check dates removed where they had been presented as lifecycle events
- broad Meta `older versions` row downgraded to review-required / unknown and excluded from canonical data
- old draft PR #22 closed unmerged as superseded historical staging

See:

- `docs/runbooks/ledger-series-phase8-stage2-closeout.md`
- `docs/runbooks/phase8-meta-graph-version-split-review.md`

## Current implementation target — Stage 3

Build deterministic per-API machine-readable output from canonical directories only:

- `data/entities`
- `data/events`
- `data/evidence`

Requirements:

- canonical-only per-API dossiers
- deterministic index/manifest output
- stable public file paths
- entity/event/evidence linkage validation
- generated-file completeness validation
- CI drift detection
- automatic exclusion of display-only/noncanonical rows, including the Meta placeholder

`data/records.json` remains a public display manifest and is not canonical authority.

## Remaining Phase 8 sequence

1. Stage 3 — per-API machine-readable JSON
2. Stage 4 — structured migration filters
3. Stage 5 — migration-history Compare
4. Stage 6 — migration and quality Stats
5. Stage 7 — reviewed lifecycle follow-up and production verification
6. Stage 8 — closeout

## Safety boundary

- Unknown remains unknown.
- Future deadlines are not completion evidence.
- Phased shutdowns are not collapsed into fake universal completion dates.
- Scope-dependent lifecycle states remain scope-dependent.
- Canonical mutation requires reviewed changes.
- Display manifests and candidate/staging files do not become canonical by reuse.
- No AI-generated canonical dates, replacements, or lifecycle claims.
- No subjective vendor ranking.
