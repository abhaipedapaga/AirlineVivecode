import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginSuccess, logout } from '../features/auth/authSlice';

function makeFakeJwt(payload) {
  // Fake JWT for demo: header.payload.signature (not secure, just for UI flow)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa('fake-signature');
  return `${header}.${body}.${signature}`;
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/';

  function handleLogin(e) {
    e.preventDefault();
    setError('');

    // Simple validation (mock)
    if (!email.trim()) return setError('Email is required.');
    if (!password.trim()) return setError('Password is required.');

    const token = makeFakeJwt({ email, iat: Date.now() });

    dispatch(
      loginSuccess({
        token,
        user: { email, name: 'Demo User' },
      })
    );

    navigate(redirectTo, { replace: true });
  }

  function handleLogout() {
    dispatch(logout());
  }

  if (isLoggedIn) {
    return (
      <div className="p-6 border rounded-xl">
        <h1 className="text-2xl font-semibold">You’re logged in ✅</h1>
        <p className="mt-2 text-gray-700">Signed in as: {user?.email}</p>

        <div className="mt-4 flex gap-3">
          <Link
            to="/bookings"
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
          >
            Go to Bookings
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-1 text-sm text-gray-600">Demo auth with fake JWT stored in localStorage.</p>

      <form onSubmit={handleLogin} className="mt-6 grid grid-cols-1 gap-4 max-w-md">
        <label className="text-sm">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="demo@example.com"
          />
        </label>

        <label className="text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="password"
          />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
