import { apiGet, apiPost } from './api';

export function createBooking(payload) {
  return apiPost('/bookings', payload);
}

export function listBookings(email) {
  return apiGet(`/bookings?email=${encodeURIComponent(email)}`);
}
