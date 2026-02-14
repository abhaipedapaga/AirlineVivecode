import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /flights?from=JFK&to=LAX
router.get('/flights', async (req, res) => {
  try {
    const { from, to } = req.query;

    const where = [];
    const params = [];

    if (from) {
      where.push('from_airport = ?');
      params.push(String(from).toUpperCase());
    }
    if (to) {
      where.push('to_airport = ?');
      params.push(String(to).toUpperCase());
    }

    const sql = `
      SELECT
        id,
        airline,
        from_airport AS \`from\`,
        to_airport AS \`to\`,
        depart_time AS departTime,
        arrive_time AS arriveTime,
        duration,
        price
      FROM flights
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY depart_time ASC
      LIMIT 100
    `;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to fetch flights' });
  }
});

// GET /flights/:id
router.get('/flights/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        airline,
        from_airport AS \`from\`,
        to_airport AS \`to\`,
        depart_time AS departTime,
        arrive_time AS arriveTime,
        duration,
        price
      FROM flights
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Flight not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to fetch flight' });
  }
});

// GET /flights/:id/seats
router.get('/flights/:id/seats', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        seat_code AS code,
        CAST(SUBSTRING(seat_code, 1, LENGTH(seat_code)-1) AS UNSIGNED) AS rowNum,
        RIGHT(seat_code, 1) AS col,
        status
      FROM seats
      WHERE flight_id = ?
      ORDER BY rowNum ASC, col ASC
      `,
      [id]
    );

    // map to your frontend shape: { code, row, col, status }
    const seats = rows.map((s) => ({
      code: s.code,
      row: s.rowNum,
      col: s.col,
      status: s.status,
    }));

    res.json(seats);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to fetch seats' });
  }
});

export default router;
