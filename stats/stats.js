const els = {
  records: document.querySelector('#stat-records'),
  events: document.querySelector('#stat-events'),
  evidence: document.querySelector('#stat-evidence'),
  windowBody: document.querySelector('#migration-window-body'),
  status: document.querySelector('#status-stats'),
  replacement: document.querySelector('#replacement-stats'),
  event: document.querySelector('#event-stats'),
  providerBody: document.querySelector('#provider-body'),
  confidence: document.querySelector('#confidence-stats'),
  freshness: document.querySelector('#freshness-stats'),
  dates: document.querySelector('#date-stats'),
  note: document.querySelector('#stats-note')
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function text(value) {
  return String(value ?? 'unknown').replaceAll('_', ' ');
}

function dateToMs(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(parsed) ? null : parsed;
}

function migrationWindow(record) {
  const start = record.deprecated_at || record.announced_at || null;
  const end = record.migration_deadline_at || record.removal_effective_at || record.sunset_at || null;
  const startMs = dateToMs(start);
  const endMs = dateToMs(end);
  if (startMs === null || endMs === null || endMs < startMs) return { days: null, bucket: 'unknown' };
  const days = Math.round((endMs - startMs) / 86400000);
  const bucket = days < 30 ? 'Under 30 days' : days < 90 ? '30–89 days' : days < 180 ? '90–179 days' : '180+ days';
  return { days, bucket };
}

function countBy(records, getter) {
  const counts = new Map();
  for (const record of records) {
    const values = getter(record);
    for (const value of Array.isArray(values) ? values : [values]) {
      const key = value || 'unknown';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function percent(count, total) {
  return total ? `${((count / total) * 100).toFixed(1)}%` : '0.0%';
}

function renderStatList(element, entries, total) {
  element.innerHTML = entries.map(([label, count]) => `
    <div class="stat-row"><span>${escapeHtml(text(label))}</span><strong>${count}</strong><small>${percent(count, total)}</small></div>
  `).join('');
}

function renderWindowStats(records) {
  const windows = records.map(migrationWindow);
  const order = ['Under 30 days', '30–89 days', '90–179 days', '180+ days', 'unknown'];
  const counts = new Map(order.map((key) => [key, 0]));
  for (const window of windows) counts.set(window.bucket, (counts.get(window.bucket) || 0) + 1);
  els.windowBody.innerHTML = order.map((bucket) => {
    const count = counts.get(bucket) || 0;
    return `<tr><td>${escapeHtml(bucket === 'unknown' ? 'Unknown / incomplete dates' : bucket)}</td><td>${count}</td><td>${percent(count, records.length)}</td></tr>`;
  }).join('');
}

function renderProviderStats(records) {
  const providers = new Map();
  for (const record of records) {
    const row = providers.get(record.provider) || { total: 0, removed: 0, usable: 0 };
    row.total += 1;
    if (record.status === 'removed' || record.status === 'replaced') row.removed += 1;
    if (record.still_usable === 'yes' || record.still_usable === 'partial') row.usable += 1;
    providers.set(record.provider, row);
  }
  const sorted = [...providers.entries()].sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));
  els.providerBody.innerHTML = sorted.map(([provider, values]) => `
    <tr><td>${escapeHtml(provider)}</td><td>${values.total}</td><td>${values.removed}</td><td>${values.usable}</td></tr>
  `).join('');
}

function renderDateCoverage(records) {
  const fields = [
    ['announcement date', 'announced_at'],
    ['deprecation date', 'deprecated_at'],
    ['sunset date', 'sunset_at'],
    ['removal-effective date', 'removal_effective_at'],
    ['migration deadline', 'migration_deadline_at']
  ];
  const entries = fields.map(([label, field]) => [label, records.filter((record) => Boolean(record[field])).length]);
  renderStatList(els.dates, entries, records.length);
}

async function init() {
  try {
    const response = await fetch('/data/machine/index.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`machine index HTTP ${response.status}`);
    const index = await response.json();
    if (index.canonical_only !== true) throw new Error('machine index is not canonical-only');
    if (!Array.isArray(index.records) || index.record_count !== index.records.length) throw new Error('machine index count mismatch');
    if (index.records.some((record) => record.slug === 'meta-graph-api-older-versions')) throw new Error('noncanonical Meta placeholder leaked into machine index');

    const records = index.records;
    const totalEvents = records.reduce((sum, record) => sum + (record.event_count || 0), 0);
    const totalEvidence = records.reduce((sum, record) => sum + (record.evidence_count || 0), 0);

    els.records.textContent = String(records.length);
    els.events.textContent = String(totalEvents);
    els.evidence.textContent = String(totalEvidence);

    renderWindowStats(records);
    renderStatList(els.status, countBy(records, (record) => record.status), records.length);
    renderStatList(els.replacement, countBy(records, (record) => record.replacement_type), records.length);
    renderStatList(els.event, countBy(records, (record) => record.event_types || []), totalEvents || records.length);
    renderProviderStats(records);
    renderStatList(els.confidence, countBy(records, (record) => record.confidence), records.length);
    renderStatList(els.freshness, countBy(records, (record) => record.freshness_status), records.length);
    renderDateCoverage(records);

    const primaryEvidence = records.reduce((sum, record) => sum + (record.primary_evidence_count || 0), 0);
    els.note.textContent = `${records.length} canonical records · ${totalEvents} events · ${totalEvidence} evidence · ${primaryEvidence} primary evidence · revision ${index.data_revision.slice(0, 12)}…`;
  } catch (error) {
    els.note.textContent = `Stats unavailable: ${error.message}`;
  }
}

init();
