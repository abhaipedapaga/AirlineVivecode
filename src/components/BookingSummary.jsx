import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function BookingSummary() {
  const { selectedFlight, selectedSeat, passengers, totalPrice } = useSelector(
    (s) => s.booking
  );

  if (!selectedFlight) return null;

  return (
    <div className="border-t bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold">
            {selectedFlight.from} → {selectedFlight.to} ({selectedFlight.id})
          </span>
          <span className="text-gray-600">
            {' '}
            • Seat: {selectedSeat || '—'} • Passengers: {passengers.length} • Total: $
            {totalPrice}
          </span>
        </div>

        <Link
          to="/checkout"
          className="px-3 py-2 rounded-md bg-black text-white hover:opacity-90 text-sm"
        >
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}
