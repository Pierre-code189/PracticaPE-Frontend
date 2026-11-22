// Utilidades de formato (migradas de api.js → ui.*)
export function saveSession(token, user) {
  if (token) localStorage.setItem('pp_token', token);
  if (user) localStorage.setItem('pp_user', JSON.stringify(user));
}
export function currentUser() {
  try { return JSON.parse(localStorage.getItem('pp_user') || 'null'); } catch { return null; }
}
export function clearSession() {
  localStorage.removeItem('pp_token');
  localStorage.removeItem('pp_user');
}

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function money(s) {
  const n = Number(String(s).replace(/[^\d.]/g, ''));
  if (!isFinite(n)) return String(s || '');
  return 'S/ ' + n.toLocaleString('es-PE');
}

export function fecha(s) {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return String(s);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function initials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase() || '?';
}

export function salario(j) {
  if (!j || !j.salary) return '';
  const s = String(j.salary).trim();
  const base = /^S\//i.test(s) ? s : 'S/ ' + s;
  return /\/?\s*m\b/i.test(s) ? base : base + '/m';
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
