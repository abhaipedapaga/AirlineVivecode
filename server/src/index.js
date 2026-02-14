import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.js';
import flightRoutes from './routes/flights.js';
import bookingRoutes from './routes/bookings.js';


dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(healthRoutes);
app.use(flightRoutes);
app.use(bookingRoutes);



app.get('/', (req, res) => {
  res.send('Airline API running');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
