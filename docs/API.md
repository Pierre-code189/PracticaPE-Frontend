# API PracticaPE (prefijo base: /)

Auth: `POST /auth/request-otp {email,name,role}` → `{dev_code}` en dev · `POST /auth/verify-otp {email,code}` → `{access_token,user}`
Jobs: `GET /jobs?q&modality&district&city&company_id&status` · `GET /jobs/map` · `GET /jobs/districts` · `GET /jobs/{id}` (contacto solo si postulaste) · `POST /jobs` · `PUT|DELETE /jobs/{id}` · `POST /jobs/{id}/apply` (única) · `POST|DELETE /jobs/{id}/save` · `GET /jobs/saved/mine` · `GET /jobs/{id}/applicants` · `PATCH /jobs/{id}/applicants/{appId} {status}`
Social: `POST /social/preview` · `POST /social/import {url|text,publish}` → borrador
Collect: `POST /collect/run {query}` (admin) · `GET /collect/status` · `GET /collect/jobs`
Admin: `GET /admin/dashboard` (kpis+charts) · `GET /admin/queue` · `PATCH /admin/queue/{id}?action=approve|reject` · `GET /admin/otps` · `GET /admin/leads`
Perfil: `GET|PUT /me/profile` · `POST|DELETE /me/profile/items` · `POST|DELETE /me/profile/photos` · `GET /me/applications` · `GET /me/cv` (texto) · `GET /me/notifications` · `PATCH /me/notifications/{id}/read`
Negocio: `GET|PUT /business/profile` · `GET /business/dashboard`
Público: `GET /companies` · `GET /companies/{id}` · `POST /intake` (lead) · `GET /health`
