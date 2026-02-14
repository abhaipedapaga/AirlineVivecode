import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /bookings?email=john@example.com
router.get('/bookings', async (req, res) => {
  try {
    const email = String(req.query.email || '').trim();
    if (!email) return res.status(400).json({ message: 'email query param required' });

    const [rows] = await pool.query(
      `
      SELECT
        b.id,
        b.flight_id AS flightId,
        b.email,
        b.phone,
        b.promo_code AS promoCode,
        b.payment_method AS paymentMethod,
        b.payment_last4 AS paymentLast4,
        b.total,
        b.created_at AS createdAt,
        f.airline,
        f.from_airport AS \`from\`,
        f.to_airport AS \`to\`,
        f.depart_time AS departTime,
        f.arrive_time AS arriveTime,
        f.duration,
        f.price
      FROM bookings b
      JOIN flights f ON f.id = b.flight_id
      WHERE b.email = ?
      ORDER BY b.created_at DESC
      `,
      [email]
    );

    // attach passengers + seats for each booking
    const bookingIds = rows.map((r) => r.id);
    if (bookingIds.length === 0) return res.json([]);

    const [passengers] = await pool.query(
      `SELECT booking_id AS bookingId, full_name AS fullName, dob, passport
       FROM booking_passengers WHERE booking_id IN (?)`,
      [bookingIds]
    );

    const [seats] = await pool.query(
      `SELECT booking_id AS bookingId, seat_code AS seat
       FROM booking_seats WHERE booking_id IN (?)`,
      [bookingIds]
    );

    const pBy = new Map();
    passengers.forEach((p) => {
      if (!pBy.has(p.bookingId)) pBy.set(p.bookingId, []);
      pBy.get(p.bookingId).push({ fullName: p.fullName, dob: p.dob, passport: p.passport });
    });

    const sBy = new Map();
    seats.forEach((s) => {
      if (!sBy.has(s.bookingId)) sBy.set(s.bookingId, []);
      sBy.get(s.bookingId).push(s.seat);
    });

    const out = rows.map((b) => ({
      ...b,
      passengers: pBy.get(b.id) || [],
      seats: sBy.get(b.id) || [],
    }));

    res.json(out);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to load bookings' });
  }
});

// POST /bookings
// body: { flightId, passenger, contact, seatCode, promoCode, payment, total }
router.post('/bookings', async (req, res) => {
  const {
    flightId,
    seatCode,
    passenger,
    contact,
    promoCode,
    payment,
    total,
  } = req.body || {};

  const fId = String(flightId || '').trim();
  const sCode = String(seatCode || '').toUpperCase().trim();
  const email = String(contact?.email || '').trim();
  const phone = contact?.phone ? String(contact.phone).trim() : null;

  if (!fId) return res.status(400).json({ message: 'flightId is required' });
  if (!sCode) return res.status(400).json({ message: 'seatCode is required' });
  if (!email) return res.status(400).json({ message: 'contact.email is required' });
  if (!passenger?.fullName) return res.status(400).json({ message: 'passenger.fullName is required' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ensure seat is reserved (must already be reserved by FS4 click)
    const [seatRows] = await conn.query(
      `SELECT status FROM seats WHERE flight_id=? AND seat_code=? FOR UPDATE`,
      [fId, sCode]
    );

    if (!seatRows.length) {
      await conn.rollback();
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seatRows[0].status !== 'reserved') {
      await conn.rollback();
      return res.status(409).json({ message: 'Seat must be reserved before booking' });
    }

    // Create booking
    const payMethod = payment?.method === 'paypal' ? 'paypal' : 'card';
    const last4 = payMethod === 'card' ? String(payment?.last4 || '').slice(-4) : null;

    const [bookingRes] = await conn.query(
      `
      INSERT INTO bookings (flight_id, email, phone, promo_code, payment_method, payment_last4, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [fId, email, phone, promoCode || null, payMethod, last4, Number(total || 0)]
    );

    const bookingId = bookingRes.insertId;

    // passenger
    await conn.query(
      `
      INSERT INTO booking_passengers (booking_id, full_name, dob, passport)
      VALUES (?, ?, ?, ?)
      `,
      [
        bookingId,
        passenger.fullName,
        passenger.dob || null,
        passenger.passport || null,
      ]
    );

    // seat record
    await conn.query(
      `
      INSERT INTO booking_seats (booking_id, flight_id, seat_code)
      VALUES (?, ?, ?)
      `,
      [bookingId, fId, sCode]
    );

    await conn.commit();
    res.status(201).json({ ok: true, bookingId });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ message: e.message || 'Failed to create booking' });
  } finally {
    conn.release();
  }
});

export default router;
