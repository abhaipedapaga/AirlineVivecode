import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { searchFlights } from '../services/flights';
import { setSearchParams, setSearchResults } from '../features/search/searchSlice';
const heroImg = new  URL('../assets/hero.jpg', import.meta.url).href;


export default function Search() {
  const dispatch = useDispatch();
  const { params, results } = useSelector((s) => s.search);

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function load() {
    try {
      setStatus('loading');
      setError('');
      const data = await searchFlights(params);
      dispatch(setSearchResults(data));
      setStatus('success');
    } catch (e) {
      setError(e?.message || 'Failed to load flights.');
      setStatus('error');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="-mt-8">
      {/* HERO */}
      <section className="relative min-h-[420px] overflow-hidden rounded-2xl">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}

        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Search flights. Book fast.
          </h1>
          <p className="mt-3 text-white/85 max-w-2xl">
            Find the best fares and reserve your seat with real-time updates.
          </p>

          {/* SEARCH CARD */}
          <div className="mt-10 bg-white/95 backdrop-blur border border-white/30 rounded-2xl shadow-lg p-4 md:p-5 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label className="text-xs font-medium text-gray-600">
                From
                <input
                  value={params.from}
                  onChange={(e) => dispatch(setSearchParams({ from: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="JFK"
                />
              </label>

              <label className="text-xs font-medium text-gray-600">
                To
                <input
                  value={params.to}
                  onChange={(e) => dispatch(setSearchParams({ to: e.target.value }))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="LAX"
                />
              </label>

              <label className="text-xs font-medium text-gray-600">
                Date (mock)
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                />
              </label>

              <div className="flex items-end">
                <button
                  onClick={load}
                  className="w-full rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Search flights
                </button>
              </div>
            </div>

            {/* status row */}
            <div className="mt-3">
              {status === 'loading' && <Loading label="Searching flights..." />}
              {status === 'error' && <ErrorState message={error} onRetry={load} />}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Available flights</h2>
            <p className="text-sm text-gray-600">Showing results for your search.</p>
          </div>
          <div className="text-sm text-gray-600">
            {status === 'success' ? `${results.length} result(s)` : ''}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {status === 'success' && results.length === 0 && (
            <div className="border rounded-2xl p-6 bg-white">
              <p className="text-gray-700">No flights found. Try changing airports.</p>
            </div>
          )}

          {status === 'success' &&
            results.map((f) => (
              <div
                key={f.id}
                className="border rounded-2xl bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {f.from} → {f.to}
                    </p>
                    <span className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                      {f.id}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {f.airline} • {f.duration}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">From</div>
                    <div className="text-2xl font-bold">${f.price}</div>
                  </div>

                  <Link
                    to={`/flight/${f.id}`}
                    className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
