const listEl = document.querySelector('#timeline-list');
const countEl = document.querySelector('#timeline-count');

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

function render(events) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  countEl.textContent = `${sorted.length} events`;
  listEl.innerHTML = sorted.map((event) => `
    <article class="deadline-card">
      <div>
        <p class="eyebrow">${escapeHtml(event.date)}</p>
        <h3><a href="../apis/${escapeHtml(event.slug)}/">${escapeHtml(event.name)}</a></h3>
        <p class="muted">${escapeHtml(event.provider)}</p>
      </div>
      <p>${escapeHtml(event.event)}</p>
      <dl>
        <dt>Event type</dt><dd>${escapeHtml(text(event.type))}</dd>
        <dt>Action</dt><dd>${escapeHtml(text(event.actionRequired))}</dd>
        <dt>Risk</dt><dd>${escapeHtml(text(event.productionRisk))}</dd>
      </dl>
      <p><a href="${escapeHtml(event.evidenceUrl)}" target="_blank" rel="noopener noreferrer">Official source</a></p>
    </article>
  `).join('');
}

async function init() {
  try {
    const response = await fetch('../data/timeline.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(await response.json());
  } catch (error) {
    countEl.textContent = 'Unable to load events';
    listEl.innerHTML = `<p class="detail-content">Unable to load events: ${escapeHtml(error.message)}</p>`;
  }
}

init();
