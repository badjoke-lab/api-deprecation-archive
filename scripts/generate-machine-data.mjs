import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');

const SOURCE_DIRS = {
  entities: 'data/entities',
  events: 'data/events',
  evidence: 'data/evidence'
};

const OUTPUT_ROOT = 'data/machine';
const RECORD_ROOT = `${OUTPUT_ROOT}/records`;

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

function stableJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function readJsonDir(dir) {
  return readdirSync(join(ROOT, dir))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const path = `${dir}/${name}`;
      return {
        path,
        data: JSON.parse(readFileSync(join(ROOT, path), 'utf8'))
      };
    });
}

function maxDate(values) {
  const dates = values.filter((value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)).sort();
  return dates.at(-1) ?? null;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function buildOutputs() {
  const entities = readJsonDir(SOURCE_DIRS.entities);
  const events = readJsonDir(SOURCE_DIRS.events);
  const evidence = readJsonDir(SOURCE_DIRS.evidence);

  const entityIds = new Set(entities.map(({ data }) => data.id));
  const eventsByEntity = new Map();
  const evidenceByEntity = new Map();

  for (const item of events) {
    if (!entityIds.has(item.data.entity_id)) {
      throw new Error(`${item.path}: event references noncanonical entity ${item.data.entity_id}`);
    }
    const list = eventsByEntity.get(item.data.entity_id) ?? [];
    list.push(item);
    eventsByEntity.set(item.data.entity_id, list);
  }

  for (const item of evidence) {
    if (!entityIds.has(item.data.entity_id)) {
      throw new Error(`${item.path}: evidence references noncanonical entity ${item.data.entity_id}`);
    }
    const list = evidenceByEntity.get(item.data.entity_id) ?? [];
    list.push(item);
    evidenceByEntity.set(item.data.entity_id, list);
  }

  const canonicalRevisionPayload = {
    entities: entities.map(({ path, data }) => ({ path, data })),
    events: events.map(({ path, data }) => ({ path, data })),
    evidence: evidence.map(({ path, data }) => ({ path, data }))
  };
  const dataRevision = sha256(stableJson(canonicalRevisionPayload));
  const lastCheckedAt = maxDate([
    ...entities.map(({ data }) => data.last_checked_at),
    ...evidence.map(({ data }) => data.last_checked_at)
  ]);

  const outputs = new Map();
  const indexRecords = [];

  for (const entityItem of [...entities].sort((a, b) => a.data.slug.localeCompare(b.data.slug))) {
    const entity = entityItem.data;
    const entityEvents = [...(eventsByEntity.get(entity.id) ?? [])].sort((a, b) => {
      const byDate = a.data.date.localeCompare(b.data.date);
      return byDate || a.data.id.localeCompare(b.data.id);
    });
    const entityEvidence = [...(evidenceByEntity.get(entity.id) ?? [])].sort((a, b) => a.data.id.localeCompare(b.data.id));
    const eventTypes = [...new Set(entityEvents.map(({ data }) => data.type))].sort();
    const primaryEvidenceCount = entityEvidence.filter(({ data }) => data.is_primary === true).length;

    const dossier = {
      schema_version: '1.0.0',
      project_id: 'api-deprecation-archive',
      record_type: 'api_lifecycle_dossier',
      canonical_only: true,
      data_revision: dataRevision,
      entity,
      events: entityEvents.map(({ data }) => data),
      evidence: entityEvidence.map(({ data }) => data),
      lifecycle_signals: {
        event_types: eventTypes,
        removal_effective_date_recorded: Boolean(entity.removal_effective_at),
        migration_deadline_recorded: Boolean(entity.migration_deadline_at),
        replacement_recorded: Boolean(entity.replacement),
        primary_evidence_count: primaryEvidenceCount
      },
      provenance: {
        display_manifest_used_as_authority: false,
        entity_file: entityItem.path,
        event_files: entityEvents.map(({ path }) => path),
        evidence_files: entityEvidence.map(({ path }) => path)
      },
      urls: {
        human: `/apis/${entity.slug}/`,
        machine: `/data/machine/records/${entity.slug}.json`
      }
    };

    outputs.set(`${RECORD_ROOT}/${entity.slug}.json`, stableJson(dossier));
    indexRecords.push({
      id: entity.id,
      slug: entity.slug,
      canonical_name: entity.canonical_name,
      provider: entity.provider,
      category: entity.category,
      record_unit: entity.record_unit,
      status: entity.status,
      deprecation_stage: entity.deprecation_stage,
      deadline_status: entity.deadline_status,
      still_usable: entity.still_usable,
      action_required: entity.action_required,
      impact_level: entity.impact_level,
      production_risk: entity.production_risk,
      freshness_status: entity.freshness_status,
      source_status: entity.source_status,
      confidence: entity.confidence,
      announced_at: entity.announced_at ?? null,
      deprecated_at: entity.deprecated_at ?? null,
      sunset_at: entity.sunset_at ?? null,
      last_supported_at: entity.last_supported_at ?? null,
      removal_effective_at: entity.removal_effective_at ?? null,
      migration_deadline_at: entity.migration_deadline_at ?? null,
      replacement: entity.replacement ?? null,
      replacement_type: entity.replacement_type,
      event_types: eventTypes,
      event_count: entityEvents.length,
      evidence_count: entityEvidence.length,
      primary_evidence_count: primaryEvidenceCount,
      last_checked_at: entity.last_checked_at,
      human_url: `/apis/${entity.slug}/`,
      machine_url: `/data/machine/records/${entity.slug}.json`
    });
  }

  const index = {
    schema_version: '1.0.0',
    project_id: 'api-deprecation-archive',
    canonical_only: true,
    data_revision: dataRevision,
    record_count: indexRecords.length,
    records: indexRecords
  };

  const manifest = {
    schema_version: '1.0.0',
    project_id: 'api-deprecation-archive',
    registry_type: 'developer_api_migration_history',
    canonical_only: true,
    data_revision: dataRevision,
    last_checked_at: lastCheckedAt,
    record_counts: {
      entities: entities.length,
      events: events.length,
      evidence: evidence.length
    },
    source_of_truth: {
      entities: '/data/entities/',
      events: '/data/events/',
      evidence: '/data/evidence/',
      display_manifest_is_authority: false
    },
    public_files: {
      version: '/version.json',
      record_index: '/data/machine/index.json',
      record_template: '/data/machine/records/{slug}.json',
      llms: '/llms.txt',
      ai: '/ai.txt'
    },
    record_level: {
      enabled: true,
      record_count: entities.length,
      route_template: '/data/machine/records/{slug}.json',
      human_route_template: '/apis/{slug}/'
    },
    data_safety: {
      canonical_directories_only: true,
      display_only_rows_included: false,
      unreviewed_candidates_included: false,
      ai_generated_facts_included: false,
      unknown_values_preserved: true
    }
  };

  const version = {
    schema_version: '1.0.0',
    project_id: 'api-deprecation-archive',
    canonical_only: true,
    data_revision: dataRevision,
    last_checked_at: lastCheckedAt,
    record_counts: manifest.record_counts,
    manifest: '/data/machine/manifest.json',
    record_index: '/data/machine/index.json',
    record_template: '/data/machine/records/{slug}.json'
  };

  outputs.set(`${OUTPUT_ROOT}/index.json`, stableJson(index));
  outputs.set(`${OUTPUT_ROOT}/manifest.json`, stableJson(manifest));
  outputs.set('version.json', stableJson(version));
  outputs.set(
    'llms.txt',
    [
      '# API Deprecation Archive',
      '',
      'Evidence-based developer lifecycle and migration-history registry.',
      '',
      'Canonical only: true',
      `Canonical entities: ${entities.length}`,
      `Lifecycle events: ${events.length}`,
      `Evidence records: ${evidence.length}`,
      `Data revision: ${dataRevision}`,
      `Last checked: ${lastCheckedAt ?? 'unknown'}`,
      '',
      'Machine-readable files:',
      '- /version.json',
      '- /data/machine/manifest.json',
      '- /data/machine/index.json',
      '- /data/machine/records/{slug}.json',
      '',
      'The machine layer is generated only from schema-validated canonical entity/event/evidence directories.',
      'Display-only rows and unreviewed candidates are excluded.',
      'Unknown lifecycle facts remain unknown; phased or scope-dependent shutdowns are not converted into unsupported universal dates.',
      ''
    ].join('\n')
  );
  outputs.set(
    'ai.txt',
    [
      'API Deprecation Archive canonical migration-history registry',
      'Canonical only: true',
      `Entities: ${entities.length}`,
      `Events: ${events.length}`,
      `Evidence: ${evidence.length}`,
      `Data revision: ${dataRevision}`,
      'Manifest: /data/machine/manifest.json',
      'Record index: /data/machine/index.json',
      'Per-API dossier: /data/machine/records/{slug}.json',
      'Source authority: data/entities + data/events + data/evidence',
      'Display manifest authority: false',
      'No AI-generated canonical dates or replacement claims.',
      ''
    ].join('\n')
  );

  return { outputs, entitySlugs: entities.map(({ data }) => data.slug).sort(), dataRevision };
}

function expectedRecordPaths(entitySlugs) {
  return entitySlugs.map((slug) => `${slug}.json`).sort();
}

function checkOutputs(outputs, entitySlugs) {
  const errors = [];
  for (const [path, expected] of outputs) {
    const full = join(ROOT, path);
    if (!existsSync(full)) {
      errors.push(`${path}: missing generated output`);
      continue;
    }
    const actual = readFileSync(full, 'utf8');
    if (actual !== expected) errors.push(`${path}: generated output drift`);
  }

  const actualRecordFiles = existsSync(join(ROOT, RECORD_ROOT))
    ? readdirSync(join(ROOT, RECORD_ROOT)).filter((name) => name.endsWith('.json')).sort()
    : [];
  const expectedRecords = expectedRecordPaths(entitySlugs);
  if (JSON.stringify(actualRecordFiles) !== JSON.stringify(expectedRecords)) {
    errors.push(`${RECORD_ROOT}: file-set mismatch; expected ${expectedRecords.length}, found ${actualRecordFiles.length}`);
  }

  const actualMachineJson = existsSync(join(ROOT, OUTPUT_ROOT))
    ? readdirSync(join(ROOT, OUTPUT_ROOT)).filter((name) => name.endsWith('.json')).sort()
    : [];
  const expectedMachineJson = ['index.json', 'manifest.json'];
  if (JSON.stringify(actualMachineJson) !== JSON.stringify(expectedMachineJson)) {
    errors.push(`${OUTPUT_ROOT}: top-level JSON file-set mismatch`);
  }

  if (errors.length) {
    console.error(`Machine-data drift check failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Machine-data drift check passed: ${entitySlugs.length} canonical per-API dossiers`);
}

function writeOutputs(outputs) {
  rmSync(join(ROOT, RECORD_ROOT), { recursive: true, force: true });
  mkdirSync(join(ROOT, RECORD_ROOT), { recursive: true });
  for (const [path, content] of outputs) {
    const full = join(ROOT, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
}

const { outputs, entitySlugs, dataRevision } = buildOutputs();

if (CHECK_ONLY) {
  checkOutputs(outputs, entitySlugs);
} else {
  writeOutputs(outputs);
  console.log(`Generated ${entitySlugs.length} canonical per-API dossiers`);
  console.log(`data_revision=${dataRevision}`);
}
