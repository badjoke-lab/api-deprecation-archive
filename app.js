const statusLine = document.createElement('p');
statusLine.className = 'runtime-note';
statusLine.textContent = 'Static shell loaded. Data-driven pages will be added in upcoming PRs.';

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.site-footer');
  if (footer) footer.appendChild(statusLine);
});
