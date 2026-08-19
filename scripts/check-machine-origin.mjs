import { readFileSync } from 'node:fs';

const origin = (process.env.API_DEP_ORIGIN ?? '').replace(/\/$/, '');
const attempts = Number(process.env.API_DEP_VERIFY_ATTEMPTS ?? '20');
const intervalMs = Number(process.env.API_DEP_VERIFY_INTERVAL_MS ?? '15000');
const expected = JSON.parse(readFileSync('version.json', 'utf8'));

if (!origin.startsWith('https://')) {
  throw new Error('API_DEP_ORIGIN must be an https origin');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fail = (message) => { throw new Error(message); };

async function fetchResponse(path) {
  const separator = path.includes('?') ? '&' : '?';
  return fetch(`${origin}${path}${separator}verify=${expected.data_revision.slice(0, 16)}`, {
    headers: { 'cache-control': 'no-cache' },
    redirect: 'follow'
  });
}

async function fetchJson(path) {
  const response = await fetchResponse(path);
  if (!response.ok) fail(`${path}: HTTP ${response.status}`);
  return response.json();
}

async function fetchText(path) {
  const response = await fetchResponse(path);
  if (!response.ok) fail(`${path}: HTTP ${response.status}`);
  return response.text();
}

function requireEqual(actual, expectedValue, label) {
  if (actual !== expectedValue) fail(`${label}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actual)}`);
}

function requireIncludes(source, marker, label) {
  if (!source.includes(marker)) fail(`${label}: missing ${JSON.stringify(marker)}`);
}

async function requireNoCanonicalDossier(path, slug) {
  const response = await fetchResponse(path);
  if (response.status === 404) return;
  if (!response.ok) fail(`${path}: unexpected HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    // Cloudflare Pages can serve the HTML site fallback with HTTP 200 for an
    // unknown static path. That is absence of a machine dossier, not a leak.
  }

  if (parsed?.entity?.slug === slug || parsed?.record_type === 'api_lifecycle_dossier') {
    fail(`${path}: noncanonical dossier exists in production`);
  }
  if (contentType.includes('application/json') || parsed !== null) {
    fail(`${path}: unexpected JSON response for noncanonical dossier path`);
  }
}

async function verifyOnce() {
  const version = await fetchJson('/version.json');
  requireEqual(version.canonical_only, true, 'version canonical_only');
  requireEqual(version.data_revision, expected.data_revision, 'version data_revision');
  for (const key of ['entities', 'events', 'evidence']) {
    requireEqual(version.record_counts?.[key], expected.record_counts?.[key], `version ${key} count`);
  }

  const manifest = await fetchJson('/data/machine/manifest.json');
  requireEqual(manifest.canonical_only, true, 'manifest canonical_only');
  requireEqual(manifest.data_revision, expected.data_revision, 'manifest data_revision');
  for (const key of ['entities', 'events', 'evidence']) {
    requireEqual(manifest.record_counts?.[key], expected.record_counts?.[key], `manifest ${key} count`);
  }
  requireEqual(manifest.data_safety?.display_only_rows_included, false, 'manifest display-only safety');
  requireEqual(manifest.data_safety?.ai_generated_facts_included, false, 'manifest AI-fact safety');

  const index = await fetchJson('/data/machine/index.json');
  requireEqual(index.canonical_only, true, 'index canonical_only');
  requireEqual(index.data_revision, expected.data_revision, 'index data_revision');
  requireEqual(index.record_count, expected.record_counts?.entities, 'index record count');
  const slugs = new Set(index.records?.map((record) => record.slug) ?? []);
  for (const slug of ['fcm-legacy-http-xmpp-apis', 'paypal-nvp-soap-apis', 'stripe-sources-api', 'slack-files-upload', 'shopify-rest-admin-api']) {
    if (!slugs.has(slug)) fail(`index missing representative canonical slug: ${slug}`);
  }
  if (slugs.has('meta-graph-api-older-versions')) fail('noncanonical Meta display placeholder leaked into machine index');

  const fcm = await fetchJson('/data/machine/records/fcm-legacy-http-xmpp-apis.json');
  requireEqual(fcm.entity?.id, 'apidep_entity_000016', 'FCM entity id');
  requireEqual(fcm.entity?.removal_effective_at, null, 'FCM removal_effective_at');
  requireEqual(fcm.events?.[0]?.date, '2023-06-20', 'FCM deprecation date');
  requireEqual(fcm.events?.[0]?.deadline, '2024-07-22', 'FCM shutdown-start boundary');
  requireEqual(fcm.events?.[0]?.removal_date, null, 'FCM removal date must remain unknown');

  const paypal = await fetchJson('/data/machine/records/paypal-nvp-soap-apis.json');
  requireEqual(paypal.entity?.still_usable, 'yes', 'PayPal current usability');
  requireEqual(paypal.entity?.deadline_status, 'no_deadline', 'PayPal deadline status');
  requireEqual(paypal.events?.length, 0, 'PayPal dated event count');
  requireEqual(paypal.evidence?.length, 1, 'PayPal evidence count');

  const stripe = await fetchJson('/data/machine/records/stripe-sources-api.json');
  requireEqual(stripe.entity?.status, 'limited', 'Stripe status');
  requireEqual(stripe.entity?.deadline_status, 'unknown', 'Stripe deadline status');
  requireEqual(stripe.events?.length, 0, 'Stripe dated event count');

  const slack = await fetchJson('/data/machine/records/slack-files-upload.json');
  requireEqual(slack.entity?.status, 'removed', 'Slack current status');
  requireEqual(slack.entity?.still_usable, 'no', 'Slack current usability');
  requireEqual(slack.entity?.removal_effective_at, '2025-11-12', 'Slack removal date');
  if (!slack.events?.some((event) => event.type === 'api_removed' && event.date === '2025-11-12')) {
    fail('Slack removal event missing');
  }
  if ((slack.evidence?.length ?? 0) < 2) fail('Slack evidence history is incomplete');

  const shopify = await fetchJson('/data/machine/records/shopify-rest-admin-api.json');
  requireEqual(shopify.entity?.status, 'deprecated', 'Shopify current status');
  requireEqual(shopify.entity?.deadline_status, 'no_deadline', 'Shopify deadline status');
  requireEqual(shopify.entity?.migration_deadline_at, null, 'Shopify universal migration deadline');
  requireEqual(shopify.entity?.replacement, 'GraphQL Admin API', 'Shopify replacement');

  await requireNoCanonicalDossier('/data/machine/records/meta-graph-api-older-versions.json', 'meta-graph-api-older-versions');

  const llms = await fetchText('/llms.txt');
  requireIncludes(llms, `Canonical entities: ${expected.record_counts.entities}`, 'llms.txt canonical count');
  requireIncludes(llms, `Lifecycle events: ${expected.record_counts.events}`, 'llms.txt event count');
  requireIncludes(llms, `Evidence records: ${expected.record_counts.evidence}`, 'llms.txt evidence count');
  requireIncludes(llms, `Data revision: ${expected.data_revision}`, 'llms.txt data revision');

  const ai = await fetchText('/ai.txt');
  requireIncludes(ai, `Entities: ${expected.record_counts.entities}`, 'ai.txt canonical count');
  requireIncludes(ai, `Events: ${expected.record_counts.events}`, 'ai.txt event count');
  requireIncludes(ai, `Evidence: ${expected.record_counts.evidence}`, 'ai.txt evidence count');
  requireIncludes(ai, `Data revision: ${expected.data_revision}`, 'ai.txt data revision');

  return version;
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const version = await verifyOnce();
    console.log('Machine-origin verification PASS');
    console.log(`origin=${origin}`);
    console.log(`data_revision=${version.data_revision}`);
    console.log(`counts=${version.record_counts.entities} entities / ${version.record_counts.events} events / ${version.record_counts.evidence} evidence`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(intervalMs);
  }
}

throw lastError;
