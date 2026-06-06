const pageType = document.body.dataset.lifecyclePage;
const listEl = document.querySelector('#lifecycle-records');
const countEl = document.querySelector('#lifecycle-count');

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function text(value) {
  return String(value || '').replace(/_/g, ' ');
}

function matchesPage(record) {
  if (pageType === 'removed') {
    return record.stage === 'removed' || record.stillUsable === 'no' || record.deadlineStatus === 'passed_removed';
  }
  return record.stage !== 'removed' && record.stillUsable !== 'no';
}

function renderCard(record) {
  return `
    <article class="deadline-card">
      <div>
        <h3><a href="../apis/${escapeHtml(record.slug)}/">${escapeHtml(record.name)}</a></h3>
        <p class="muted">${escapeHtml(record.provider)} · ${escapeHtml(record.category)}</p>
      </div>
      <dl>
        <dt>Status</dt><dd>${escapeHtml(text(record.stage))}</dd>
        <dt>Deadline status</dt><dd>${escapeHtml(text(record.deadlineStatus))}</dd>
        <dt>Still usable</dt><dd>${escapeHtml(text(record.stillUsable))}</dd>
        <dt>Action</dt><dd>${escapeHtml(text(record.actionRequired))}</dd>
        <dt>Replacement</dt><dd>${escapeHtml(record.replacement || 'Unknown')}</dd>
        <dt>Risk</dt><dd>${escapeHtml(text(record.productionRisk))}</dd>
      </dl>
      <p><a href="${escapeHtml(record.evidenceUrl)}" target="_blank" rel="noopener noreferrer">Official source</a></p>
    </article>
  `;
}

async function init() {
  try {
    const response = await fetch('../data/records.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const records = (await response.json()).filter(matchesPage);
    countEl.textContent = `${records.length} records`;
    listEl.innerHTML = records.length ? records.map(renderCard).join('') : '<p class="muted">No records found.</p>';
  } catch (error) {
    countEl.textContent = 'Unable to load records';
    listEl.innerHTML = `<p class="detail-content">Unable to load records: ${escapeHtml(error.message)}</p>`;
  }
}

init();
