const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}
