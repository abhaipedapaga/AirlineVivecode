import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Plane, LogOut } from 'lucide-react';

const linkClass = ({ isActive }) =>
  [
    'relative inline-flex items-center rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-gray-900',
    isActive
      ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm'
      : 'text-white/70 hover:bg-white/[0.08] hover:text-white',
  ].join(' ');

export default function NavBar() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <NavLink
            to="/"
            className="group inline-flex items-center gap-3 text-white font-semibold tracking-wide transition-opacity hover:opacity-90"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
              <Plane className="h-4.5 w-4.5 text-white" />
            </span>
            <span className="text-base">Airline Booking</span>
          </NavLink>

          {/* Links */}
          <nav className="flex items-center gap-1.5">
            <NavLink to="/search" className={linkClass}>
              Flights
            </NavLink>

            <NavLink to="/bookings" className={linkClass}>
              Bookings
            </NavLink>

            <NavLink to="/login" className={linkClass}>
              {isLoggedIn ? 'Account' : 'Login'}
            </NavLink>

            {/* Logout */}
            {isLoggedIn && (
              <button
                onClick={() => dispatch(logout())}
                className={[
                  'ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                  'border border-white/10 text-white/80 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300',
                  'focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-gray-900',
                ].join(' ')}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
