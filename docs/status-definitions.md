# Status Definitions

This document defines the public lifecycle fields used by API Deprecation Archive.

## status

General current state.

Allowed values:

- `active`
- `limited`
- `deprecated`
- `sunsetting`
- `removed`
- `replaced`
- `unknown`

## deprecation_stage

API-specific lifecycle stage.

Allowed values:

- `active`
- `announced`
- `deprecated`
- `sunsetting`
- `removed`
- `replaced`
- `unknown`

## deadline_status

Allowed values:

- `no_deadline`
- `upcoming`
- `passed_unverified`
- `passed_removed`
- `extended`
- `unknown`

Rules:

- future deadline: `upcoming`
- past deadline without re-verification: `passed_unverified`
- confirmed removal: `passed_removed`
- official deadline extension: `extended`
- no deadline exists: `no_deadline`
- unclear deadline: `unknown`

## still_usable

Required field.

Allowed values:

- `yes`
- `no`
- `partial`
- `unknown`

Use `unknown` when official documentation does not clearly confirm current behavior.

## action_required

Allowed values:

- `none`
- `monitor`
- `migrate`
- `update_sdk`
- `replace_endpoint`
- `rotate_auth`
- `remove_usage`
- `unknown`

## production_risk

Risk to an existing production integration if no action is taken.

Allowed values:

- `low`
- `medium`
- `high`
- `critical`
- `unknown`

## impact_level

Size or importance of the public lifecycle change.

Allowed values:

- `low`
- `medium`
- `high`
- `critical`
- `unknown`

## freshness_status

Allowed values:

- `fresh`
- `watch`
- `stale`
- `unknown`

Rules:

- `fresh`: last checked within 60 days
- `watch`: last checked 61–90 days ago
- `stale`: last checked 91+ days ago
- `unknown`: last checked is missing or cannot be evaluated

Deprecated, sunsetting, and upcoming-deadline records should be rechecked more carefully.

## replacement_type

Allowed values:

- `official`
- `recommended`
- `partial`
- `community`
- `none`
- `unknown`

v0 should mainly use `official`, `partial`, `none`, and `unknown`.

## source_status

Allowed values:

- `official`
- `secondary_confirmed`
- `archived_only`
- `unclear`

v0 seed records should prefer `official` or `archived_only`.
