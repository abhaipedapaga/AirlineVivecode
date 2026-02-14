import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { listBookings } from '../services/bookings';

export default function Bookings() {
  const [email, setEmail] = useState(() => localStorage.getItem('airline_last_email') || '');
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  async function load(targetEmail) {
    const e = (targetEmail ?? email).trim();

    if (!e) {
      setData([]);
      setStatus('idle');
      setError('');
      return;
    }

    try {
      setStatus('loading');
      setError('');
      localStorage.setItem('airline_last_email', e);

      const list = await listBookings(e);
      setData(list);
      setStatus('success');
    } catch (err) {
      setError(err?.message || 'Failed to load bookings.');
      setStatus('error');
    }
  }

  useEffect(() => {
    // auto-load if user already booked before (email saved)
    if (email.trim()) load(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 border rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-600">Loaded from MySQL via API.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => load()}
            className="px-3 py-2 rounded-md border hover:bg-gray-50"
            disabled={!email.trim() || status === 'loading'}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Email search box */}
      <div className="mt-6 p-4 border rounded-xl bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="text-sm flex-1">
            Enter the email you used during checkout
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder="you@example.com"
            />
          </label>

          <button
            onClick={() => load(email)}
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-60"
            disabled={!email.trim() || status === 'loading'}
          >
            Load bookings
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-600">
          Tip: this page filters by email because we haven’t connected real auth → userId yet.
        </p>
      </div>

      <div className="mt-6">
        {status === 'loading' && <Loading label="Loading bookings..." />}
        {status === 'error' && <ErrorState message={error} onRetry={() => load(email)} />}

        {status !== 'loading' && status !== 'error' && !email.trim() ? (
          <div className="text-gray-700">
            <p>Enter your email to view bookings.</p>
            <Link
              to="/search"
              className="inline-block mt-3 px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
            >
              Search flights
            </Link>
          </div>
        ) : null}

        {status === 'success' && (
          <>
            {data.length === 0 ? (
              <div className="text-gray-700">
                <p>No bookings found for <span className="font-medium">{email}</span>.</p>
                <Link
                  to="/search"
                  className="inline-block mt-3 px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
                >
                  Book a flight
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.map((b) => (
                  <div key={b.id} className="p-4 border rounded-xl bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="font-semibold">
                        Booking #{b.id} • Flight {b.flightId}
                      </p>
                      <span className="text-xs text-gray-600">
                        {b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <p>
                        Route:{' '}
                        <span className="font-medium">
                          {b.from} → {b.to}
                        </span>{' '}
                        • {b.airline}
                      </p>

                      <p>
                        Seats:{' '}
                        <span className="font-medium">
                          {(b.seats || []).join(', ') || '—'}
                        </span>
                      </p>

                      <p>
                        Passenger(s):{' '}
                        <span className="font-medium">
                          {(b.passengers || []).map((p) => p.fullName).join(', ') || '—'}
                        </span>
                      </p>

                      <p>
                        Payment:{' '}
                        <span className="font-medium">
                          {b.paymentMethod}
                          {b.paymentMethod === 'card' && b.paymentLast4 ? ` (**** ${b.paymentLast4})` : ''}
                        </span>
                      </p>

                      <p>
                        Total: <span className="font-semibold">${b.total}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
