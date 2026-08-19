# Phase 8 — Meta Graph API version-split review

Date: 2026-08-20
Status: canonical acceptance deferred
Display record: `meta-graph-api-older-versions`

## Finding

The current display label `Meta Graph API older versions` is not a stable canonical entity boundary. `older versions` changes over time as Meta releases and sunsets concrete Graph API versions, so treating that moving set as one lifecycle entity would collapse multiple announcement, support, sunset, and migration histories into a single ambiguous record.

## Current evidence boundary

The existing display record points to Meta's Graph API changelog. During this review, version-specific first-party lifecycle facts sufficient to define one stable canonical entity were not established from the current record itself.

The previous timeline entry dated `2026-06-08` was a repository review date, not a verified Meta lifecycle event. It has therefore been removed from the public timeline.

No deprecation date, sunset date, still-usable state, replacement version, or production-risk level is inferred from the broad label.

## Decision

- do not create `apidep_entity_000014` from the broad `older versions` display row;
- keep the display row visible only as a review-required placeholder;
- set its lifecycle fields to unknown/monitor where version-specific evidence is missing;
- do not create a canonical event from a review/check date;
- preserve ID 000014 as unused until a reviewed canonical boundary is selected.

## Next acceptable canonical work

1. Select a concrete Meta Graph API version or explicitly bounded version family.
2. Recover first-party Meta documentation that identifies its release/support/sunset boundary.
3. Verify the applicable migration/current-version guidance without inferring a successor from generic version churn.
4. Create entity/event/evidence records only after those facts are supported.
5. If multiple concrete versions are relevant, create separate lifecycle records rather than recreating an `older versions` catch-all.

Unknown remains unknown until that review is complete.
