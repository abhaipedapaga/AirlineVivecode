import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { reserveSeat } from '../services/seats';
import { setSelectedSeat } from '../features/booking/bookingSlice';

export default function SeatMap({ flightId, seats = [], onSeatReserved }) {
  const dispatch = useDispatch();
  const selectedSeat = useSelector((s) => s.booking.selectedSeat);

  const [busySeat, setBusySeat] = useState(null);
  const [error, setError] = useState('');

  const byRow = seats.reduce((acc, s) => {
    acc[s.row] = acc[s.row] || [];
    acc[s.row].push(s);
    return acc;
  }, {});

  const rows = Object.keys(byRow)
    .map(Number)
    .sort((a, b) => a - b);

  async function handleSelect(seat) {
    if (!flightId) return;

    try {
      setError('');
      setBusySeat(seat.code);

      // ✅ reserve in DB first
      await reserveSeat(flightId, seat.code);

      // ✅ then update redux selection
      dispatch(setSelectedSeat(seat.code));

      // ✅ tell parent to refresh seat map UI
      onSeatReserved?.(seat.code);
    } catch (e) {
      setError(e?.message || 'Failed to reserve seat.');
    } finally {
      setBusySeat(null);
    }
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Seat Map (Click to select)</h2>

      {error ? (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r} className="flex items-center gap-2">
            <span className="w-8 text-sm text-gray-600">{r}</span>

            <div className="flex flex-wrap gap-2">
              {byRow[r].map((s) => {
                const isReserved = s.status === 'reserved';
                const isSelected = selectedSeat === s.code;
                const isBusy = busySeat === s.code;

                return (
                  <button
                    key={s.code}
                    type="button"
                    disabled={isReserved || isBusy}
                    onClick={() => handleSelect(s)}
                    className={[
                      'px-2 py-1 rounded-md text-xs border transition',
                      isReserved
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'hover:bg-gray-50',
                      isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-800',
                      isBusy ? 'opacity-60 cursor-wait' : '',
                    ].join(' ')}
                    aria-pressed={isSelected}
                    aria-label={`Seat ${s.code} ${isReserved ? 'reserved' : 'available'}`}
                  >
                    {isBusy ? '...' : s.code}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <span className="inline-block w-3 h-3 bg-white border mr-2 align-middle" />
        Available
        <span className="inline-block w-3 h-3 bg-black border ml-4 mr-2 align-middle" />
        Selected
        <span className="inline-block w-3 h-3 bg-gray-200 border ml-4 mr-2 align-middle" />
        Reserved
      </div>
    </div>
  );
}
