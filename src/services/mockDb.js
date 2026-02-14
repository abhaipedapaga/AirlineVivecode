export const flightsDb = [
  {
    id: 'AA123',
    airline: 'American Airlines',
    from: 'JFK',
    to: 'LAX',
    departTime: '2026-03-01T09:30:00',
    arriveTime: '2026-03-01T12:45:00',
    duration: '6h 15m',
    price: 349,
  },
  {
    id: 'DL456',
    airline: 'Delta',
    from: 'EWR',
    to: 'SFO',
    departTime: '2026-03-01T10:10:00',
    arriveTime: '2026-03-01T13:50:00',
    duration: '6h 40m',
    price: 379,
  },
  {
    id: 'UA789',
    airline: 'United',
    from: 'JFK',
    to: 'ORD',
    departTime: '2026-03-01T08:00:00',
    arriveTime: '2026-03-01T09:40:00',
    duration: '1h 40m',
    price: 159,
  },
];

export const seatsDbByFlightId = {
  AA123: generateSeatMap(8, ['A', 'B', 'C', 'D', 'E', 'F'], ['1A', '2C', '4D']),
  DL456: generateSeatMap(10, ['A', 'B', 'C', 'D', 'E', 'F'], ['3B', '6F']),
  UA789: generateSeatMap(6, ['A', 'B', 'C', 'D'], ['1B', '5D']),
};

function generateSeatMap(rows, cols, reservedList = []) {
  const reserved = new Set(reservedList);
  const seats = [];

  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const code = `${r}${c}`;
      seats.push({
        code,
        row: r,
        col: c,
        status: reserved.has(code) ? 'reserved' : 'available',
      });
    }
  }
  return seats;
}
