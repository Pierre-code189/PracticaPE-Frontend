// PracticaPE — capa de API (migrada de vanilla api.js)
// Token en localStorage('pp_token'). Errores como Error con .status.

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, opts = {}) {
  const token = localStorage.getItem('pp_token');
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API_BASE + path, { ...opts, headers });
  const ct = res.headers.get('content-type') || '';
  const body = ct.includes('application/json')
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    const err = new Error((body?.detail || body?.error) || 'HTTP ' + res.status);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

const qs = (params) =>
  new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();

export const api = {
  // autenticación
  requestOtp: (email, role) =>
    request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email, role }) }),
  verifyOtp: (email, code) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) }),
  me: () => request('/me'),

  // ofertas
  jobs: (params = {}) => request('/jobs' + (qs(params) ? '?' + qs(params) : '')),
  job: (id) => request('/jobs/' + id),
  jobMap: (params = {}) => request('/jobs/map' + (qs(params) ? '?' + qs(params) : '')),
  districts: () => request('/jobs/districts'),
  jobSources: () => request('/jobs/sources'),
  submitJob: (payload) => request('/jobs/submit', { method: 'POST', body: JSON.stringify(payload) }),
  apply: (id, payload = {}) =>
    request(`/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify(payload) }),
  saveJob: (id, on) =>
    request(`/jobs/${id}/save`, { method: on ? 'POST' : 'DELETE' }),
  savedMine: () => request('/jobs/saved/mine'),
  applicants: (id) => request(`/jobs/${id}/applicants`),
  createJob: (payload) => request('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
  updateJob: (id, payload) =>
    request(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  closeJob: (id) => request(`/jobs/${id}/close`, { method: 'POST' }),

  // empresas
  companies: (params = {}) => request('/companies' + (qs(params) ? '?' + qs(params) : '')),
  company: (id) => request('/companies/' + id),
  businessProfile: () => request('/business/profile'),
  saveBusinessProfile: (payload) =>
    request('/business/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  businessDashboard: () => request('/business/dashboard'),
  businessJobs: () => request('/business/jobs'),

  // perfil candidato
  myProfile: () => request('/me/profile'),
  saveMyProfile: (payload) =>
    request('/me/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  addItem: (payload) =>
    request('/me/profile/items', { method: 'POST', body: JSON.stringify(payload) }),
  deleteItem: (id) => request('/me/profile/items/' + id, { method: 'DELETE' }),
  myApplications: () => request('/me/applications'),
  myNotifications: () => request('/me/notifications'),
  markNotification: (id) => request(`/me/notifications/${id}/read`, { method: 'PATCH' }),
  publicProfile: (id) => request('/profiles/' + id),

  // admin
  adminDashboard: () => request('/admin/dashboard'),
  adminQueue: () => request('/admin/queue'),
  adminModerate: (id, action) =>
    request(`/admin/queue/${id}?action=${action}`, { method: 'PATCH' }),
  adminLeads: () => request('/admin/leads'),
  adminUsers: () => request('/admin/users'),

  // público
  intake: (payload) => request('/intake', { method: 'POST', body: JSON.stringify(payload) }),
};
