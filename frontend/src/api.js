export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) =>
    fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),

  login: (body) =>
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handle),

  listClients: () =>
    fetch(`${API_BASE}/clients`, { headers: authHeaders() }).then(handle),

  getClient: (id) =>
    fetch(`${API_BASE}/clients/${id}`, { headers: authHeaders() }).then(handle),

  createClient: (body) =>
    fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handle),

  updateClient: (id, body) =>
    fetch(`${API_BASE}/clients/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handle),

  deleteClient: (id) =>
    fetch(`${API_BASE}/clients/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),

  getClientQr: (id) =>
    fetch(`${API_BASE}/clients/${id}/qr`, { headers: authHeaders() }).then(handle),

  getPublic: (slug) =>
    fetch(`${API_BASE}/public/${slug}`).then(handle),
};
