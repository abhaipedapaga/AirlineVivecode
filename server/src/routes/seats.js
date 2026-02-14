import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

/**
 * POST /flights/:id/seats/reserve
 * body: { seatCode: "2A" }
 *
 * Guarantees: only reserves if status is currently 'available'
 */
router.post('/flights/:id/seats/reserve', async (req, res) => {
  const flightId = req.params.id;
  const seatCode = String(req.body?.seatCode || '').toUpperCase().trim();

  if (!seatCode) {
    return res.status(400).json({ message: 'seatCode is required' });
  }

  try {
    // atomic update prevents double booking
    const [result] = await pool.query(
      `
      UPDATE seats
      SET status = 'reserved'
      WHERE flight_id = ? AND seat_code = ? AND status = 'available'
      `,
      [flightId, seatCode]
    );

    if (result.affectedRows === 0) {
      // seat not found or already reserved
      return res.status(409).json({ message: `Seat ${seatCode} is not available` });
    }

    return res.json({ ok: true, flightId, seatCode, status: 'reserved' });
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to reserve seat' });
  }
});

export default router;
