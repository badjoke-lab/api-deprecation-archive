# API Deprecation Archive — AI-era Execution Schedule

Status: Ledger Series Phase 8 COMPLETE
Last synchronized: 2026-08-20

## Fixed Phase 8 order

1. Current-main gap audit — **COMPLETE**
2. Canonical backfill and schema gate — **COMPLETE WITH EXPLICIT PRIMARY-EVIDENCE GAP**
3. Per-API machine-readable JSON — **COMPLETE**
4. Structured migration filters — **COMPLETE**
5. Migration-history Compare — **COMPLETE**
6. Migration and quality Stats — **COMPLETE**
7. Reviewed lifecycle follow-up and production verification — **COMPLETE**
8. Closeout — **COMPLETE**

## Final accepted Phase 8 state

Accepted reviewed main before closeout docs: `d9e86725a894cd95db383b47fcb51334490e66fc`.

- 20 public display rows
- 19 schema-validated canonical entities
- 18 canonical lifecycle events
- 20 canonical evidence records
- deterministic machine data revision: `8da5be8df926ec754bf63c081e33f14ac19a6f89143c7e2d617b96c0304be47c`
- 0 schema expansions required for Phase 8 implementation
- 1 explicit noncanonical display-only pending row: `meta-graph-api-older-versions`

The Meta row is not a failed count target. It remains outside canonical and machine-readable output until a concrete version or bounded version family is supported by version-specific first-party lifecycle evidence.

## Completed implementation surfaces

### Stage 3 — machine-readable lifecycle dossiers

Canonical inputs remain only:

- `data/entities`
- `data/events`
- `data/evidence`

Public machine surfaces:

- `/version.json`
- `/data/machine/manifest.json`
- `/data/machine/index.json`
- `/data/machine/records/{slug}.json`
- `/llms.txt`
- `/ai.txt`

Generated output is deterministic and CI fails on tracked/untracked machine drift.

### Stage 4 — structured migration filters

`/apis/` is backed by the canonical machine index and dossiers, with filters for provider, category, canonical status, lifecycle stage, deadline state, usability, action, replacement type, production risk, freshness, confidence, lifecycle event type, migration-window bucket, and recorded boundary date ranges.

Migration-window length is derived only when supported start/end dates exist in canonical fields. Unknown remains unknown.

### Stage 5 — migration-history Compare

`/compare/` compares two canonical records across lifecycle state, dates, migration window, replacement, events, evidence coverage, known unknowns, and machine provenance. It does not rank providers or recommend a winner.

### Stage 6 — migration and quality Stats

`/stats/` reports canonical coverage for record/event/evidence totals, migration-window buckets, lifecycle status, replacement type, event types, provider coverage, confidence/freshness, structured date coverage, and primary evidence. Provider counts are not scores. No deprecation-reason distribution is manufactured because the current schema has no structured reason field.

### Stage 7 — reviewed follow-up and production verification

Representative first-party follow-up on 2026-08-20 reconfirmed Firebase Dynamic Links, Google PaLM API, and Kubernetes v1.22 removed APIs; corrected Shopify REST Admin API deadline scope; and advanced Slack `files.upload` to removed after official confirmation of the 2025-11-12 sunset.

Slack retains both its earlier deprecation event and a separate removal event/evidence record. Shopify no longer treats 2025-04-01 as a universal migration/removal deadline for all existing REST integrations.

Combined production verification passed against `https://api-deprecation-archive.pages.dev`:

- Stage 3 production run: `32279706138`, job `96155299566`
- final combined production run: `32282447418`, job `96164114080`
- final reviewed revision: `8da5be8df926ec754bf63c081e33f14ac19a6f89143c7e2d617b96c0304be47c`
- final counts: 19 entities / 18 events / 20 evidence
- machine layer: PASS
- structured filters: PASS
- Compare: PASS
- Stats: PASS
- sitemap: PASS
- representative Slack/Shopify human pages: PASS

## Phase 8 closeout boundary

Phase 8 completion does not stop normal registry maintenance. Future work may continue to:

- add reviewed API lifecycle records;
- refresh first-party evidence;
- correct canonical facts;
- resolve the Meta version-specific evidence gap;
- extend lifecycle history when new deprecation/removal/replacement facts become public.

Those are vertical registry-maintenance tasks unless a new reviewed horizontal authority explicitly reopens Phase 8.

The Ledger Series horizontal roadmap moves next to **Phase 9 — Series cross-registry layer**.

## Gate

Spec -> reviewed implementation PR -> validation/CI green -> merge -> production verification where applicable -> docs/status sync.

## Mandatory continuation rule

Future work must read the v0.1 spec, relevant schema/methodology/source documents, `ai-era-registry-spec.md`, this schedule, the current status runbook, and the Phase 8 closeout audit before selecting the next task.
