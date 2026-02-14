import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import BookingSummary from './BookingSummary';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* ✅ Home = full width, other pages stay centered */}
      <main className={isHome ? 'flex-1' : 'mx-auto max-w-5xl px-4 py-6 flex-1'}>
        <Outlet />
      </main>

      <BookingSummary />
    </div>
  );
}
