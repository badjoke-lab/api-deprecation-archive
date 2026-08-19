# Ledger Series Phase 8 — Stage 2 Closeout

Date: 2026-08-20
Stage: canonical backfill and schema gate
Status: complete with one explicit primary-evidence gap
Accepted main: `2bdbe2fd1ad125d013ffec5329bc802ba57b66f2`

## Result

Stage 2 repaired the split between the 20-row public display seed and the schema-validated canonical layer without treating the display manifest as authority.

Accepted canonical totals at closeout:

- display rows: 20
- canonical entities: 19
- canonical lifecycle events: 17
- canonical evidence records: 19
- schema expansion: 0

Reviewed backfill PRs:

- #25 — records 6–10
- #26 — records 11–15
- #27 — records 16–20

The original five canonical seed entities remain part of the 19 accepted total.

## Important corrections made during backfill

The backfill was not a mechanical copy of the old display layer. Current first-party review changed several lifecycle facts, including:

- AWS SDK for JavaScript v2: end-of-support is not runtime removal; published releases remain available.
- Google URL Shortener goo.gl links: Google's 2025 update narrowed deactivation to a defined inactive-link subset; universal removal is false.
- Azure AD Graph: fully retired on 2025-08-31, not an upcoming 2026 deadline.
- Dropbox API v1: retired on 2017-09-28; the former 2026 date was a repository review date, not a lifecycle event.
- PayPal NVP/SOAP: legacy/deprecated but currently supported; no shutdown date was invented.
- Twilio Authy: closed to new customers while qualifying existing customers remain supported; no exact End-of-Life date is asserted.
- FCM legacy HTTP/XMPP: 2023-06-20 is the deprecation date and 2024-07-22 is documented as shutdown start, not a proven universal completion date.
- Exchange Online Basic authentication: present state is disabled for affected protocols, but the rollout was phased and is not collapsed into a fabricated single final-completion date.
- Google Container Registry: shut down effective 2025-03-18; Artifact Registry-backed `gcr.io` paths do not mean Container Registry itself remains active.
- Stripe Sources: deprecated with scope-dependent availability; no universal shutdown date is asserted.

## Explicit unresolved display row

`meta-graph-api-older-versions` remains a public review-required placeholder and is not canonical.

Reason:

- `older versions` is a moving set, not a stable API-version entity boundary;
- the previous 2026-06-08 timeline item was a review/check date rather than a verified Meta lifecycle event and was removed;
- Meta's current developer documentation could not be retrieved reliably during the Stage 2 review because the first-party developer site returned rate limiting, and no version-specific first-party lifecycle record sufficient for canonical acceptance was recovered;
- third-party summaries are not substituted for the missing primary evidence.

The reserved canonical ID `apidep_entity_000014` remains unused.

See `docs/runbooks/phase8-meta-graph-version-split-review.md` for the version-split gate.

## Schema decision

No schema expansion was required.

The existing v0.1 entity/event/evidence model can represent:

- removed and replaced states;
- deprecated-but-still-supported states;
- limited/scope-dependent availability;
- phased shutdowns;
- migration and replacement guidance;
- missing or unknown dates;
- entities with current-state evidence but no dated lifecycle event.

## Superseded draft

PR #22 was closed unmerged after Stage 2. Its aggregate canonical staging bundles are historical reference only and must not be restored as canonical authority.

## Stage 3 gate

Stage 3 may proceed from the 19 accepted canonical entities.

Machine-readable output must:

1. derive only from `data/entities`, `data/events`, and `data/evidence`;
2. exclude the noncanonical Meta display placeholder automatically;
3. remain deterministic and canonical-only;
4. validate entity/event/evidence linkage and generated-file completeness;
5. fail CI if tracked machine output drifts from canonical data;
6. never synthesize a twentieth record merely to match the display-row count.
