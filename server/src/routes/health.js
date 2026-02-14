import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    res.json({ ok: rows[0].ok === 1, db: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'failed', error: e.message });
  }
});

export default router;
