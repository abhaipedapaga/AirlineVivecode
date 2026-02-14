import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import SeatMap from '../components/SeatMap';

import { getFlightDetails } from '../services/flights';
import { getSeatMap } from '../services/seats';

import { setSelectedFlight, setSeatMap, reserveSeat, updatePrice } from '../features/booking/bookingSlice';

export default function FlightDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedFlight, seatMap } = useSelector((s) => s.booking);

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const loadSeats = useCallback(async () => {
    const seats = await getSeatMap(id);
    dispatch(setSeatMap(seats));
  }, [id, dispatch]);

  const load = useCallback(async () => {
    try {
      setStatus('loading');
      setError('');

      const f = await getFlightDetails(id);
      dispatch(setSelectedFlight(f));

      await loadSeats();

      setStatus('success');
    } catch (e) {
      setError(e?.message || 'Failed to load flight.');
      setStatus('error');
    }
  }, [id, dispatch, loadSeats]);

  useEffect(() => {
    load();
  }, [load]);

  // WebSocket (optional)
  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket(`ws://localhost:8080?flightId=${id}`);
    } catch (e) {
      console.warn('WS init failed:', e);
      return;
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'SEAT_RESERVED' && msg.payload?.seatCode) {
          dispatch(reserveSeat(msg.payload.seatCode)); // mark reserved in redux seatMap
        }

        if (msg.type === 'PRICE_UPDATED' && typeof msg.payload?.price === 'number') {
          dispatch(updatePrice(msg.payload.price));
        }
      } catch {
        // ignore bad messages
      }
    };

    return () => {
      try {
        ws?.close();
      } catch {
        // ignore
      }
    };
  }, [id, dispatch]);

  if (status === 'loading') return <Loading label="Loading flight details..." />;
  if (status === 'error') return <ErrorState message={error} onRetry={load} />;
  if (!selectedFlight) return <Loading label="Preparing flight..." />;

  return (
    <div className="p-6 border rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {selectedFlight.from} → {selectedFlight.to} ({selectedFlight.id})
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {selectedFlight.airline} • {selectedFlight.duration} • ${selectedFlight.price}
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/search" className="px-3 py-2 rounded-md border hover:bg-gray-50">
            Back
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            type="button"
          >
            Fare rules
          </button>

          <Link to="/checkout" className="px-3 py-2 rounded-md bg-black text-white hover:opacity-90">
            Checkout
          </Link>
        </div>
      </div>

      {/* ✅ Pass flightId + refresh callback */}
      <SeatMap
        flightId={id}
        seats={seatMap}
        onSeatReserved={() => loadSeats()}
      />

      <Modal isOpen={isOpen} title="Fare rules (demo modal)" onClose={() => setIsOpen(false)}>
        <p>This modal traps focus, closes on Escape, and restores focus on close.</p>
      </Modal>
    </div>
  );
}
