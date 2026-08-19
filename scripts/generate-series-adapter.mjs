import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');
const SERIES_SCHEMA_VERSION = '1.0.0';
const ADAPTER_VERSION = '1.0.0';
const REGISTRY_ID = 'api-deprecation-archive';
const ORIGIN = 'https://api-deprecation-archive.pages.dev';
const OUTPUT_ROOT = 'data/series';
const RECORD_ROOT = `${OUTPUT_ROOT}/records`;

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function stableJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
}

function absolute(path) {
  if (!path) return null;
  if (/^https:\/\//.test(path)) return path;
  return `${ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function buildOutputs() {
  const version = readJson('version.json');
  const manifest = readJson('data/machine/manifest.json');
  const index = readJson('data/machine/index.json');

  if (version.canonical_only !== true || manifest.canonical_only !== true || index.canonical_only !== true) {
    throw new Error('Native machine layer must be canonical-only');
  }
  if (version.data_revision !== manifest.data_revision || version.data_revision !== index.data_revision) {
    throw new Error('Native machine revision mismatch');
  }
  if (index.record_count !== version.record_counts.entities) {
    throw new Error('Native machine index/entity count mismatch');
  }

  const outputs = new Map();
  const seriesIndexRecords = [];

  for (const row of [...index.records].sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
    const dossierPath = `data/machine/records/${row.slug}.json`;
    const dossier = readJson(dossierPath);
    if (dossier.canonical_only !== true || dossier.data_revision !== version.data_revision) {
      throw new Error(`${row.slug}: native dossier revision/canonical boundary mismatch`);
    }
    const entity = dossier.entity;
    if (!entity || entity.id !== row.id || entity.slug !== row.slug) {
      throw new Error(`${row.slug}: native identity mismatch`);
    }

    const nativeRecordType = dossier.record_type || 'api_lifecycle_dossier';
    const globalKey = `${REGISTRY_ID}:${nativeRecordType}:${entity.id}`;
    const machinePath = `/data/series/records/${entity.slug}.json`;
    const humanUrl = absolute(dossier.urls?.human || row.human_url || `/apis/${entity.slug}/`);
    const nativeMachineUrl = absolute(dossier.urls?.machine || row.machine_url || `/data/machine/records/${entity.slug}.json`);

    const envelope = {
      series_schema_version: SERIES_SCHEMA_VERSION,
      object_type: 'record_envelope',
      registry_id: REGISTRY_ID,
      global_record_key: globalKey,
      record_key: {
        native_record_type: nativeRecordType,
        native_record_id: entity.id,
        slug: entity.slug,
      },
      urls: {
        human: humanUrl,
        machine: absolute(machinePath),
        native_machine: nativeMachineUrl,
      },
      identity: {
        name: entity.canonical_name,
        aliases: Array.isArray(entity.aliases) ? entity.aliases : [],
      },
      current_state: {
        status: entity.status ?? null,
        native: {
          status: entity.status ?? null,
          deprecation_stage: entity.deprecation_stage ?? null,
          deadline_status: entity.deadline_status ?? null,
          still_usable: entity.still_usable ?? null,
          action_required: entity.action_required ?? null,
          replacement: entity.replacement ?? null,
          replacement_type: entity.replacement_type ?? null,
        },
      },
      events: {
        mode: 'inline',
        records: dossier.events ?? [],
      },
      evidence: {
        mode: 'inline',
        records: dossier.evidence ?? [],
      },
      relationships: [],
      verification: {
        data_revision: version.data_revision,
        last_verified_at: entity.last_checked_at ?? version.last_checked_at ?? null,
      },
      provenance: {
        canonical_only: true,
        adapter: {
          id: 'series-adapter-api-deprecation-archive',
          version: ADAPTER_VERSION,
        },
        native_manifest: `${ORIGIN}/data/machine/manifest.json`,
        native_record: nativeMachineUrl,
      },
    };

    outputs.set(`${RECORD_ROOT}/${entity.slug}.json`, stableJson(envelope));
    seriesIndexRecords.push({
      global_record_key: globalKey,
      native_record_type: nativeRecordType,
      native_record_id: entity.id,
      slug: entity.slug,
      name: entity.canonical_name,
      status: entity.status ?? null,
      human_url: humanUrl,
      machine_url: absolute(machinePath),
      native_machine_url: nativeMachineUrl,
    });
  }

  const descriptor = {
    series_schema_version: SERIES_SCHEMA_VERSION,
    object_type: 'registry_descriptor',
    registry: {
      id: REGISTRY_ID,
      native_project_id: manifest.project_id,
      name: 'API Deprecation Archive',
      type: manifest.registry_type,
      origin: ORIGIN,
      repository: 'https://github.com/badjoke-lab/api-deprecation-archive',
    },
    canonical_only: true,
    native_contract: {
      schema_version: manifest.schema_version,
      version_url: `${ORIGIN}/version.json`,
      manifest_url: `${ORIGIN}/data/machine/manifest.json`,
    },
    record_counts: {
      primary_records: version.record_counts.entities,
      events: version.record_counts.events,
      evidence: version.record_counts.evidence,
      native: version.record_counts,
    },
    record_types: [
      {
        series_record_type: 'api_lifecycle',
        native_record_type: 'api_lifecycle_dossier',
        machine_template: '/data/series/records/{slug}.json',
      },
    ],
    routes: {
      descriptor: '/data/series/registry.json',
      index: '/data/series/index.json',
      record_templates: ['/data/series/records/{slug}.json'],
      search: '/apis/',
      compare: '/compare/',
      stats: '/stats/',
    },
    capabilities: {
      record_json: true,
      events: 'inline',
      evidence: 'inline',
      relationships: 'none',
      search: true,
      compare: true,
      stats: true,
    },
    verification: {
      data_revision: version.data_revision,
      last_verified_at: version.last_checked_at ?? null,
    },
    data_safety: {
      canonical_only: true,
      includes_unreviewed_candidates: false,
      includes_internal_monitoring: false,
      includes_private_notes: false,
      ai_generated_canonical_facts: false,
    },
  };

  const seriesIndex = {
    series_schema_version: SERIES_SCHEMA_VERSION,
    object_type: 'record_index',
    registry_id: REGISTRY_ID,
    canonical_only: true,
    native_data_revision: version.data_revision,
    record_count: seriesIndexRecords.length,
    records: seriesIndexRecords,
  };

  outputs.set(`${OUTPUT_ROOT}/registry.json`, stableJson(descriptor));
  outputs.set(`${OUTPUT_ROOT}/index.json`, stableJson(seriesIndex));
  return { outputs, expectedRecordFiles: index.records.map((row) => `${row.slug}.json`).sort() };
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

function checkOutputs(outputs, expectedRecordFiles) {
  const errors = [];
  for (const [path, expected] of outputs) {
    const full = join(ROOT, path);
    if (!existsSync(full)) {
      errors.push(`${path}: missing`);
      continue;
    }
    if (readFileSync(full, 'utf8') !== expected) errors.push(`${path}: drift`);
  }
  const actualRecordFiles = existsSync(join(ROOT, RECORD_ROOT))
    ? readdirSync(join(ROOT, RECORD_ROOT)).filter((name) => name.endsWith('.json')).sort()
    : [];
  if (JSON.stringify(actualRecordFiles) !== JSON.stringify(expectedRecordFiles)) {
    errors.push(`${RECORD_ROOT}: file-set mismatch`);
  }
  if (errors.length) {
    console.error(`Series adapter validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Series adapter validation passed: ${expectedRecordFiles.length} record envelopes`);
}

const { outputs, expectedRecordFiles } = buildOutputs();
if (CHECK_ONLY) checkOutputs(outputs, expectedRecordFiles);
else {
  writeOutputs(outputs);
  console.log(`Generated Series adapter: ${expectedRecordFiles.length} record envelopes`);
}
