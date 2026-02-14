import { apiGet } from './api';

export function searchFlights(params = {}) {
  const from = params.from ? `from=${encodeURIComponent(params.from)}` : '';
  const to = params.to ? `to=${encodeURIComponent(params.to)}` : '';
  const qs = [from, to].filter(Boolean).join('&');

  return apiGet(`/flights${qs ? `?${qs}` : ''}`);
}

export function getFlightDetails(id) {
  return apiGet(`/flights/${id}`);
}
