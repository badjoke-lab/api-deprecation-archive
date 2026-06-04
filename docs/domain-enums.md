# Domain Enums

This document lists the v0 enum values used by API Deprecation Archive records.

## category

- `ai_api`
- `cloud_hosting_api`
- `social_platform_api`
- `payment_commerce_api`
- `developer_tool_api`
- `other`

## record_unit

- `api_group`
- `api_version`
- `sdk`
- `cli`
- `webhook`
- `auth_method`
- `developer_feature`
- `model_api`
- `pricing_or_limit_change`
- `docs_change`

## status

- `active`
- `limited`
- `deprecated`
- `sunsetting`
- `removed`
- `replaced`
- `unknown`

## deprecation_stage

- `active`
- `announced`
- `deprecated`
- `sunsetting`
- `removed`
- `replaced`
- `unknown`

## deadline_status

- `no_deadline`
- `upcoming`
- `passed_unverified`
- `passed_removed`
- `extended`
- `unknown`

## still_usable

- `yes`
- `no`
- `partial`
- `unknown`

## action_required

- `none`
- `monitor`
- `migrate`
- `update_sdk`
- `replace_endpoint`
- `rotate_auth`
- `remove_usage`
- `unknown`

## affected_surface

- `api_version`
- `endpoint`
- `sdk`
- `cli`
- `webhook`
- `auth`
- `model`
- `pricing`
- `rate_limit`
- `docs`

## risk and confidence

`impact_level`, `production_risk`, and `confidence` use:

- `low`
- `medium`
- `high`
- `critical` where applicable
- `unknown` where applicable

## freshness_status

- `fresh`
- `watch`
- `stale`
- `unknown`

## replacement_type

- `official`
- `recommended`
- `partial`
- `community`
- `none`
- `unknown`

## source_status

- `official`
- `secondary_confirmed`
- `archived_only`
- `unclear`

## event type

- `api_deprecated`
- `api_removed`
- `version_sunset`
- `sdk_deprecated`
- `sdk_removed`
- `cli_deprecated`
- `cli_removed`
- `webhook_changed`
- `webhook_removed`
- `auth_method_deprecated`
- `auth_method_removed`
- `scope_changed`
- `rate_limit_changed`
- `free_tier_removed`
- `pricing_changed`
- `breaking_change`
- `migration_deadline`
- `replacement_announced`
- `docs_removed_or_moved`
- `deadline_extended`
- `removal_confirmed`
- `unknown_status`
- `other`

## evidence type

- `official_docs`
- `official_changelog`
- `official_blog`
- `official_release_notes`
- `official_migration_guide`
- `official_github`
- `official_forum`
- `official_social`
- `archive_capture`
- `standards_document`
- `trusted_news`
- `research_report`
- `secondary_source`
- `other`

## claim_scope

- `entity`
- `deprecation`
- `removal`
- `deadline`
- `replacement`
- `migration`
- `still_usable`
- `production_risk`
- `pricing`
- `rate_limit`
- `auth`
- `webhook`
- `docs`
- `status`
- `other`

## v0 notes

- v0 should prefer official sources.
- v0 should avoid unclear sources for seed records.
- v0 should mainly use `official`, `partial`, `none`, and `unknown` for `replacement_type`.
- Community replacements should be avoided unless clearly labeled and carefully sourced.
