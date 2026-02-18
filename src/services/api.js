const API_URL = import.meta.env.VITE_API_URL || '/api';

async function parseResponse(res, fallbackMessage) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (isJson && payload?.message) ||
      (typeof payload === 'string' && payload.trim()) ||
      `${fallbackMessage}: ${res.status}`;

    throw new Error(message);
  }

  return payload;
}

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  return parseResponse(res, 'Request failed');
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return parseResponse(res, 'Request failed');
}
