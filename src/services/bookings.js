const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function createBooking(payload) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Booking failed: ${res.status}`);
  }

  return res.json();
}

export async function listBookings(email) {
  const res = await fetch(`${API_URL}/bookings?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Load bookings failed: ${res.status}`);
  }
  return res.json();
}
