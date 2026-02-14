import { Link } from 'react-router-dom';

import bgImage from '../assets/hero.jpg';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* FULL PAGE BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark layer */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CENTER HERO CARD */}
      <div className="relative flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-br from-sky-900/90 via-blue-700/85 to-indigo-900/90 p-12 text-center text-white shadow-2xl backdrop-blur">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your journey begins here
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Search flights, choose seats, and book in seconds.
          </p>

          <div className="mt-8">
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Search Flights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
