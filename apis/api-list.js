const params = new URLSearchParams(window.location.search);

const state = {
  records: [],
  filters: {
    search: params.get('q') || '',
    category: '',
    stage: '',
    risk: ''
  }
};

const els = {
  body: document.querySelector('#records-body'),
  count: document.querySelector('#result-count'),
  search: document.querySelector('#search'),
  category: document.querySelector('#category'),
  stage: document.querySelector('#stage'),
  risk: document.querySelector('#risk')
};

function text(value) {
  return String(value || '').replace(/_/g, ' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function unique(records, key) {
  return [...new Set(records.map((record) => record[key]).filter(Boolean))].sort();
}

function fillSelect(select, values) {
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text(value);
    select.appendChild(option);
  }
}

function syncSearchUrl() {
  const url = new URL(window.location.href);
  if (state.filters.search) url.searchParams.set('q', state.filters.search);
  else url.searchParams.delete('q');
  window.history.replaceState({}, '', url);
}

function recordMatches(record) {
  const search = normalize(state.filters.search);
  const haystack = normalize([
    record.name,
    record.provider,
    record.category,
    record.stage,
    record.deadlineStatus,
    record.stillUsable,
    record.actionRequired,
    record.replacement,
    record.productionRisk
  ].join(' '));

  if (search && !haystack.includes(search)) return false;
  if (state.filters.category && record.category !== state.filters.category) return false;
  if (state.filters.stage && record.stage !== state.filters.stage) return false;
  if (state.filters.risk && record.productionRisk !== state.filters.risk) return false;
  return true;
}

function render() {
  const records = state.records.filter(recordMatches);
  els.count.textContent = `${records.length} of ${state.records.length} records`;

  if (!records.length) {
    els.body.innerHTML = '<tr><td colspan="9">No records match the current filters.</td></tr>';
    return;
  }

  els.body.innerHTML = records.map((record) => `
    <tr>
      <td>
        <strong><a href="${escapeHtml(record.slug)}/">${escapeHtml(record.name)}</a></strong><br />
        <span class="muted">${escapeHtml(record.deadlineStatus)}</span>
      </td>
      <td>${escapeHtml(record.provider)}</td>
      <td>${escapeHtml(record.category)}</td>
      <td><span class="badge">${escapeHtml(text(record.stage))}</span></td>
      <td>${escapeHtml(text(record.stillUsable))}</td>
      <td>${escapeHtml(text(record.actionRequired))}</td>
      <td>${escapeHtml(record.replacement || 'Unknown')}</td>
      <td><span class="badge">${escapeHtml(text(record.productionRisk))}</span></td>
      <td><a href="${escapeHtml(record.evidenceUrl)}" rel="noopener noreferrer" target="_blank">Official source</a></td>
    </tr>
  `).join('');
}

function bindFilters() {
  els.search.addEventListener('input', (event) => {
    state.filters.search = event.target.value.trim();
    syncSearchUrl();
    render();
  });
  els.category.addEventListener('change', (event) => {
    state.filters.category = event.target.value;
    render();
  });
  els.stage.addEventListener('change', (event) => {
    state.filters.stage = event.target.value;
    render();
  });
  els.risk.addEventListener('change', (event) => {
    state.filters.risk = event.target.value;
    render();
  });
}

async function init() {
  try {
    const response = await fetch('../data/records.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.records = await response.json();

    fillSelect(els.category, unique(state.records, 'category'));
    fillSelect(els.stage, unique(state.records, 'stage'));
    fillSelect(els.risk, unique(state.records, 'productionRisk'));
    els.search.value = state.filters.search;
    bindFilters();
    render();
  } catch (error) {
    els.count.textContent = 'Unable to load records';
    els.body.innerHTML = `<tr><td colspan="9">Unable to load records: ${escapeHtml(error.message)}</td></tr>`;
  }
}

init();
