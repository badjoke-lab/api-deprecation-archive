const params = new URLSearchParams(window.location.search);

const PARAM_KEYS = {
  search: 'q',
  provider: 'provider',
  category: 'category',
  status: 'status',
  stage: 'stage',
  deadline: 'deadline',
  usable: 'usable',
  action: 'action',
  replacement: 'replacement',
  risk: 'risk',
  freshness: 'freshness',
  confidence: 'confidence',
  event: 'event',
  window: 'window',
  boundaryFrom: 'from',
  boundaryTo: 'to'
};

const state = {
  records: [],
  dataRevision: null,
  filters: Object.fromEntries(
    Object.entries(PARAM_KEYS).map(([key, param]) => [key, params.get(param) || ''])
  )
};

const els = {
  body: document.querySelector('#records-body'),
  count: document.querySelector('#result-count'),
  datasetNote: document.querySelector('#dataset-note'),
  clear: document.querySelector('#clear-filters'),
  search: document.querySelector('#search'),
  provider: document.querySelector('#provider'),
  category: document.querySelector('#category'),
  status: document.querySelector('#status'),
  stage: document.querySelector('#stage'),
  deadline: document.querySelector('#deadline'),
  usable: document.querySelector('#usable'),
  action: document.querySelector('#action'),
  replacement: document.querySelector('#replacement'),
  risk: document.querySelector('#risk'),
  freshness: document.querySelector('#freshness'),
  confidence: document.querySelector('#confidence'),
  event: document.querySelector('#event'),
  window: document.querySelector('#window'),
  boundaryFrom: document.querySelector('#boundary-from'),
  boundaryTo: document.querySelector('#boundary-to')
};

function text(value) {
  return String(value ?? '').replaceAll('_', ' ');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalize(value) {
  return String(value ?? '').toLowerCase();
}

function unique(records, getter) {
  return [...new Set(records.flatMap((record) => {
    const value = getter(record);
    return Array.isArray(value) ? value : [value];
  }).filter(Boolean))].sort();
}

function fillSelect(select, values) {
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text(value);
    select.appendChild(option);
  }
}

function dateToMs(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(parsed) ? null : parsed;
}

function migrationWindow(entity) {
  const start = entity.deprecated_at || entity.announced_at || null;
  const end = entity.migration_deadline_at || entity.removal_effective_at || entity.sunset_at || null;
  const startMs = dateToMs(start);
  const endMs = dateToMs(end);
  if (startMs === null || endMs === null || endMs < startMs) {
    return { start, end, days: null, bucket: 'unknown' };
  }
  const days = Math.round((endMs - startMs) / 86400000);
  const bucket = days < 30 ? 'lt30' : days < 90 ? '30-89' : days < 180 ? '90-179' : '180plus';
  return { start, end, days, bucket };
}

function boundaryDate(entity) {
  return entity.migration_deadline_at || entity.removal_effective_at || entity.sunset_at || null;
}

function evidenceUrl(dossier) {
  return dossier.evidence.find((item) => item.is_primary === true)?.url || dossier.evidence[0]?.url || null;
}

function buildRecord(indexRecord, dossier) {
  if (dossier.canonical_only !== true) throw new Error(`${indexRecord.slug}: dossier is not canonical-only`);
  if (dossier.data_revision !== state.dataRevision) throw new Error(`${indexRecord.slug}: data revision mismatch`);
  if (dossier.entity?.id !== indexRecord.id || dossier.entity?.slug !== indexRecord.slug) {
    throw new Error(`${indexRecord.slug}: index/dossier identity mismatch`);
  }

  const entity = dossier.entity;
  const window = migrationWindow(entity);
  return {
    ...indexRecord,
    name: entity.canonical_name,
    provider: entity.provider,
    category: entity.category,
    status: entity.status,
    stage: entity.deprecation_stage,
    deadlineStatus: entity.deadline_status,
    stillUsable: entity.still_usable,
    actionRequired: entity.action_required,
    replacement: entity.replacement,
    replacementType: entity.replacement_type,
    productionRisk: entity.production_risk,
    freshnessStatus: entity.freshness_status,
    confidence: entity.confidence,
    boundaryDate: boundaryDate(entity),
    migrationWindowDays: window.days,
    migrationWindowBucket: window.bucket,
    eventTypes: [...new Set(dossier.events.map((event) => event.type))].sort(),
    evidenceUrl: evidenceUrl(dossier),
    evidenceCount: dossier.evidence.length,
    eventCount: dossier.events.length,
    lastChecked: entity.last_checked_at,
    machineUrl: dossier.urls?.machine || indexRecord.machine_url,
    humanUrl: dossier.urls?.human || indexRecord.human_url
  };
}

function syncUrl() {
  const url = new URL(window.location.href);
  for (const [key, param] of Object.entries(PARAM_KEYS)) {
    const value = state.filters[key];
    if (value) url.searchParams.set(param, value);
    else url.searchParams.delete(param);
  }
  window.history.replaceState({}, '', url);
}

function recordMatches(record) {
  const search = normalize(state.filters.search);
  const haystack = normalize([
    record.name,
    record.provider,
    record.category,
    record.status,
    record.stage,
    record.deadlineStatus,
    record.stillUsable,
    record.actionRequired,
    record.replacement,
    record.replacementType,
    record.productionRisk,
    record.freshnessStatus,
    record.confidence,
    ...record.eventTypes
  ].join(' '));

  if (search && !haystack.includes(search)) return false;
  if (state.filters.provider && record.provider !== state.filters.provider) return false;
  if (state.filters.category && record.category !== state.filters.category) return false;
  if (state.filters.status && record.status !== state.filters.status) return false;
  if (state.filters.stage && record.stage !== state.filters.stage) return false;
  if (state.filters.deadline && record.deadlineStatus !== state.filters.deadline) return false;
  if (state.filters.usable && record.stillUsable !== state.filters.usable) return false;
  if (state.filters.action && record.actionRequired !== state.filters.action) return false;
  if (state.filters.replacement && record.replacementType !== state.filters.replacement) return false;
  if (state.filters.risk && record.productionRisk !== state.filters.risk) return false;
  if (state.filters.freshness && record.freshnessStatus !== state.filters.freshness) return false;
  if (state.filters.confidence && record.confidence !== state.filters.confidence) return false;
  if (state.filters.event && !record.eventTypes.includes(state.filters.event)) return false;
  if (state.filters.window && record.migrationWindowBucket !== state.filters.window) return false;

  const boundaryMs = dateToMs(record.boundaryDate);
  const fromMs = dateToMs(state.filters.boundaryFrom);
  const toMs = dateToMs(state.filters.boundaryTo);
  if (fromMs !== null && (boundaryMs === null || boundaryMs < fromMs)) return false;
  if (toMs !== null && (boundaryMs === null || boundaryMs > toMs)) return false;
  return true;
}

function windowLabel(record) {
  if (record.migrationWindowDays === null) return 'Unknown';
  return `${record.migrationWindowDays} days`;
}

function render() {
  const records = state.records.filter(recordMatches);
  els.count.textContent = `${records.length} of ${state.records.length} canonical records`;

  if (!records.length) {
    els.body.innerHTML = '<tr><td colspan="10">No canonical records match the current filters.</td></tr>';
    return;
  }

  els.body.innerHTML = records.map((record) => {
    const evidence = record.evidenceUrl
      ? `<a href="${escapeHtml(record.evidenceUrl)}" rel="noopener noreferrer" target="_blank">Primary evidence</a>`
      : '<span class="muted">No linked evidence URL</span>';
    return `
      <tr>
        <td>
          <strong><a href="${escapeHtml(record.humanUrl)}">${escapeHtml(record.name)}</a></strong><br />
          <a class="muted" href="${escapeHtml(record.machineUrl)}">Machine dossier</a>
        </td>
        <td>${escapeHtml(record.provider)}</td>
        <td><span class="badge">${escapeHtml(text(record.status))}</span><br /><span class="muted">${escapeHtml(text(record.stage))}</span></td>
        <td>${escapeHtml(record.boundaryDate || 'Unknown')}<br /><span class="muted">${escapeHtml(text(record.deadlineStatus))}</span></td>
        <td>${escapeHtml(text(record.stillUsable))}</td>
        <td>${escapeHtml(text(record.actionRequired))}</td>
        <td>${escapeHtml(record.replacement || 'Unknown')}<br /><span class="muted">${escapeHtml(text(record.replacementType))}</span></td>
        <td>${escapeHtml(windowLabel(record))}</td>
        <td><span class="badge">${escapeHtml(text(record.productionRisk))}</span><br /><span class="muted">${escapeHtml(text(record.freshnessStatus))}</span></td>
        <td>${evidence}<br /><span class="muted">${record.evidenceCount} evidence</span></td>
      </tr>
    `;
  }).join('');
}

function bindControl(key, eventName = 'change') {
  els[key].addEventListener(eventName, (event) => {
    state.filters[key] = event.target.value.trim();
    syncUrl();
    render();
  });
}

function hydrateControls() {
  for (const key of Object.keys(PARAM_KEYS)) {
    if (els[key]) els[key].value = state.filters[key];
  }
}

function bindFilters() {
  bindControl('search', 'input');
  for (const key of ['provider', 'category', 'status', 'stage', 'deadline', 'usable', 'action', 'replacement', 'risk', 'freshness', 'confidence', 'event', 'window', 'boundaryFrom', 'boundaryTo']) {
    bindControl(key);
  }

  els.clear.addEventListener('click', () => {
    for (const key of Object.keys(state.filters)) state.filters[key] = '';
    hydrateControls();
    syncUrl();
    render();
  });
}

function populateFilters(records) {
  fillSelect(els.provider, unique(records, (record) => record.provider));
  fillSelect(els.category, unique(records, (record) => record.category));
  fillSelect(els.status, unique(records, (record) => record.status));
  fillSelect(els.stage, unique(records, (record) => record.stage));
  fillSelect(els.deadline, unique(records, (record) => record.deadlineStatus));
  fillSelect(els.usable, unique(records, (record) => record.stillUsable));
  fillSelect(els.action, unique(records, (record) => record.actionRequired));
  fillSelect(els.replacement, unique(records, (record) => record.replacementType));
  fillSelect(els.risk, unique(records, (record) => record.productionRisk));
  fillSelect(els.freshness, unique(records, (record) => record.freshnessStatus));
  fillSelect(els.confidence, unique(records, (record) => record.confidence));
  fillSelect(els.event, unique(records, (record) => record.eventTypes));
}

async function loadCanonicalRecords() {
  const indexResponse = await fetch('/data/machine/index.json', { cache: 'no-store' });
  if (!indexResponse.ok) throw new Error(`machine index HTTP ${indexResponse.status}`);
  const index = await indexResponse.json();
  if (index.canonical_only !== true) throw new Error('machine index is not canonical-only');
  if (!Array.isArray(index.records) || index.record_count !== index.records.length) throw new Error('machine index count mismatch');

  state.dataRevision = index.data_revision;
  const dossiers = await Promise.all(index.records.map(async (indexRecord) => {
    const response = await fetch(indexRecord.machine_url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${indexRecord.slug}: dossier HTTP ${response.status}`);
    const dossier = await response.json();
    return buildRecord(indexRecord, dossier);
  }));

  return dossiers.sort((a, b) => a.name.localeCompare(b.name));
}

async function init() {
  try {
    state.records = await loadCanonicalRecords();
    populateFilters(state.records);
    hydrateControls();
    bindFilters();
    els.datasetNote.textContent = `${state.records.length} canonical dossiers · revision ${state.dataRevision.slice(0, 12)}…`;
    render();
  } catch (error) {
    els.datasetNote.textContent = 'Canonical machine layer unavailable';
    els.count.textContent = 'Unable to load canonical records';
    els.body.innerHTML = `<tr><td colspan="10">Unable to load canonical records: ${escapeHtml(error.message)}</td></tr>`;
  }
}

init();
