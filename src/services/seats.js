import { apiGet, apiPost } from './api';

export function getSeatMap(flightId) {
  return apiGet(`/flights/${flightId}/seats`);
}

export function reserveSeat(flightId, seatCode) {
  return apiPost(`/flights/${flightId}/seats/reserve`, { seatCode });
}
