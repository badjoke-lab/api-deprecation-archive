import { readFileSync } from 'node:fs';

const origin = (process.env.SERIES_ORIGIN ?? '').replace(/\/$/, '');
const attempts = Number(process.env.SERIES_VERIFY_ATTEMPTS ?? '20');
const intervalMs = Number(process.env.SERIES_VERIFY_INTERVAL_MS ?? '15000');
const descriptor = JSON.parse(readFileSync('data/series/registry.json', 'utf8'));
const index = JSON.parse(readFileSync('data/series/index.json', 'utf8'));

if (!origin.startsWith('https://')) throw new Error('SERIES_ORIGIN must be an https origin');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(path) {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${origin}${path}${separator}series_verify=${descriptor.verification.data_revision.slice(0, 16)}`, {
    headers: { 'cache-control': 'no-cache' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

function equal(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}: remote/local mismatch`);
  }
}

async function verifyOnce() {
  const remoteDescriptor = await fetchJson('/data/series/registry.json');
  equal(remoteDescriptor, descriptor, 'registry descriptor');

  const remoteIndex = await fetchJson('/data/series/index.json');
  equal(remoteIndex, index, 'record index');
  if (remoteIndex.record_count !== 19) throw new Error(`record count: expected 19, got ${remoteIndex.record_count}`);
  if (remoteIndex.records.some((record) => record.slug === 'meta-graph-api-older-versions')) {
    throw new Error('noncanonical Meta placeholder leaked into Series index');
  }

  const globalKeys = new Set();
  for (const row of remoteIndex.records) {
    if (globalKeys.has(row.global_record_key)) throw new Error(`duplicate global record key: ${row.global_record_key}`);
    globalKeys.add(row.global_record_key);
    const localEnvelope = JSON.parse(readFileSync(`data/series/records/${row.slug}.json`, 'utf8'));
    const remoteEnvelope = await fetchJson(`/data/series/records/${row.slug}.json`);
    equal(remoteEnvelope, localEnvelope, `${row.slug} envelope`);
  }

  const slack = await fetchJson('/data/series/records/slack-files-upload.json');
  if (slack.global_record_key !== 'api-deprecation-archive:api_lifecycle_dossier:apidep_entity_000003') {
    throw new Error('Slack global key mismatch');
  }
  if (slack.current_state?.status !== 'removed') throw new Error('Slack current state mismatch');
  if (slack.relationships?.length !== 0) throw new Error('API adapter must not invent relationships');
  if (slack.verification?.data_revision !== descriptor.verification.data_revision) throw new Error('Slack verification revision mismatch');
  return true;
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verifyOnce();
    console.log('Series adapter origin verification PASS');
    console.log(`origin=${origin}`);
    console.log(`registry_id=${descriptor.registry.id}`);
    console.log(`record_count=${index.record_count}`);
    console.log(`data_revision=${descriptor.verification.data_revision}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(intervalMs);
  }
}
throw lastError;
