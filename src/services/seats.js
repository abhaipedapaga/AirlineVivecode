import { apiGet } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getSeatMap(flightId) {
  return apiGet(`/flights/${flightId}/seats`);
}

export async function reserveSeat(flightId, seatCode) {
  const res = await fetch(`${API_URL}/flights/${flightId}/seats/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seatCode }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Reserve failed: ${res.status}`);
  }

  return res.json();
}
