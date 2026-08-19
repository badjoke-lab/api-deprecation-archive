# Current Status

Last updated: 2026-08-20

## Current phase

Ledger Series Phase 8 — **COMPLETE**.

Next horizontal Series work: **Phase 9 — Series cross-registry layer**.

Normal API Deprecation Archive record/evidence maintenance continues independently of the horizontal phase schedule.

## Current reviewed state

- Public display rows: 20
- Schema-validated canonical entities: 19
- Canonical lifecycle events: 18
- Canonical evidence records: 20
- Explicit noncanonical display placeholder: 1 (`meta-graph-api-older-versions`)
- Final Phase 8 reviewed implementation main: `d9e86725a894cd95db383b47fcb51334490e66fc`
- Final machine data revision: `8da5be8df926ec754bf63c081e33f14ac19a6f89143c7e2d617b96c0304be47c`

The Meta placeholder remains intentionally noncanonical. `older versions` is not a stable API-version entity boundary, and version-specific first-party lifecycle evidence has not been recovered at the quality required for canonical acceptance.

## Ledger Series Phase 8 completion

### Stage 1 — current-main gap audit

**Complete.**

- Re-read v0.1 specification, schemas, methodology, source policy, AI-era registry spec, and schedule.
- Identified the 20-row display dataset versus five initial canonical entities.
- Added repository validation CI.
- Fixed the finite Phase 8 stage order and canonical boundary.

### Stage 2 — canonical backfill and schema gate

**Complete with one explicit primary-evidence gap.**

- PR #25 — reviewed records 6–10
- PR #26 — reviewed records 11–15
- PR #27 — reviewed records 16–20
- 19 canonical entities accepted; Meta aggregate placeholder excluded.
- No Phase 8 schema expansion required.
- Stale/over-broad public facts were corrected instead of copied into canonical data.

### Stage 3 — deterministic per-API machine layer

**Complete.**

- PR #29 merged to main `10d8214b1fa34847c115a2c1ad1e4e53344e04d2`.
- Canonical entity/event/evidence directories are the only machine-data authority.
- Per-API dossiers, index, manifest, version, `llms.txt`, and `ai.txt` are generated deterministically.
- CI regenerates and fails closed on tracked/untracked machine-data drift.
- Stage 3 production verification: run `32279706138`, job `96155299566`, PASS.

### Stage 4 — structured migration filters

**Complete.**

- Clean current-main PR #33 merged to `9ca0dab7e8a25f8b44c9e9b232e937ce8f659570`.
- `/apis/` uses the canonical machine layer rather than `data/records.json`.
- Filters cover provider/category/status/stage/deadline/usability/action/replacement/risk/freshness/confidence/event/migration-window/date boundaries.
- Unknown dates remain unknown.

### Stage 5 — migration-history Compare

**Complete.**

- Clean current-main PR #34 merged to `056ac4b88e8b107a6cfb959c1ed7a898a4b3a2fc`.
- `/compare/` compares two canonical migration histories with shareable query state.
- No vendor score, winner, or ranking is generated.

### Stage 6 — migration and quality Stats

**Complete.**

- PR #35 merged to `29e3bf1b824a25fb4e24d3c668ff73e060b283b6`.
- `/stats/` reports migration-window/lifecycle/replacement/provider/evidence/freshness/date coverage from canonical machine data only.
- Missing structured deprecation reasons are not synthesized from prose.

### Stage 7 — reviewed lifecycle follow-up and production verification

**Complete.**

- PR #36 merged to `d9e86725a894cd95db383b47fcb51334490e66fc`.
- Firebase Dynamic Links, Google PaLM API, and Kubernetes v1.22 removed APIs were rechecked against first-party sources with no lifecycle change.
- Slack `files.upload` advanced to removed/no after official confirmation of the 2025-11-12 sunset; its earlier deprecation event remains in history and a separate removal event/evidence was added.
- Shopify REST Admin API was corrected so 2025-04-01 is not represented as a universal migration/removal deadline for existing REST integrations.
- Final deterministic machine state: 19 entities / 18 events / 20 evidence, revision `8da5be8df926ec754bf63c081e33f14ac19a6f89143c7e2d617b96c0304be47c`.
- Combined production verification: run `32282447418`, job `96164114080`, PASS for machine layer, filters, Compare, Stats, sitemap, and representative Slack/Shopify human pages.

### Stage 8 — closeout

**Complete when the closeout PR containing this status, schedule synchronization, and closeout audit is merged with CI green.**

No runtime/canonical change is required for Stage 8 itself.

## Maintenance boundary after Phase 8

These remain valid vertical maintenance work and do not reopen the horizontal phase by themselves:

- reviewed record additions;
- evidence refreshes;
- factual corrections;
- lifecycle follow-up;
- Meta version-specific evidence recovery;
- machine regeneration caused by reviewed canonical changes.

## Safety boundary

- Unknown remains unknown.
- Future deadlines are not completion evidence.
- Phased shutdowns are not collapsed into fake universal completion dates.
- Scope-dependent lifecycle states remain scope-dependent.
- Canonical mutation requires reviewed changes.
- Display manifests and candidate/staging files do not become canonical by reuse.
- No AI-generated canonical dates, replacements, or lifecycle claims.
- No subjective vendor ranking.
