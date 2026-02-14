import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { createBooking } from '../services/bookings';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // simple: allow +, digits, spaces, hyphens, parentheses
  return /^[+]?[\d\s()-]{7,}$/.test(phone);
}

function calcDiscount(promo) {
  const code = promo.trim().toUpperCase();
  if (code === 'SAVE10') return 0.1;
  if (code === 'STUDENT5') return 0.05;
  return 0;
}

export default function Checkout() {
  const navigate = useNavigate();

  const { selectedFlight, selectedSeat, totalPrice } = useSelector((s) => s.booking);

  // ---- Controlled form state ----
  const [passenger, setPassenger] = useState({
    fullName: '',
    dob: '',
    passport: '',
  });

  const [contact, setContact] = useState({
    email: '',
    phone: '',
  });

  const [promoCode, setPromoCode] = useState('');

  const [payment, setPayment] = useState({
    method: 'card', // card | paypal
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // UI state
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [submitError, setSubmitError] = useState('');

  // ---- Derived totals ----
  const base = totalPrice || selectedFlight?.price || 0;

  const discountRate = useMemo(() => calcDiscount(promoCode), [promoCode]);
  const discountAmount = Math.round(base * discountRate);
  const finalTotal = Math.max(0, base - discountAmount);

  // ---- Validation ----
  const errors = useMemo(() => {
    const e = {};

    // prerequisites from flow
    if (!selectedFlight?.id) e.flow = 'Please select a flight first from Search.';
    if (!selectedSeat) e.flow = 'Please select a seat first on the Flight Details page.';

    // passenger
    if (!passenger.fullName.trim()) e.fullName = 'Full name is required.';
    if (!passenger.dob) e.dob = 'Date of birth is required.';

    // contact
    if (!contact.email.trim()) e.email = 'Email is required.';
    else if (!isValidEmail(contact.email)) e.email = 'Enter a valid email.';
    if (!contact.phone.trim()) e.phone = 'Phone is required.';
    else if (!isValidPhone(contact.phone)) e.phone = 'Enter a valid phone number.';

    // payment
    if (payment.method === 'card') {
      if (!payment.cardName.trim()) e.cardName = 'Name on card is required.';
      if (!payment.cardNumber.trim()) e.cardNumber = 'Card number is required.';
      else if (payment.cardNumber.replace(/\s/g, '').length < 12) e.cardNumber = 'Card number looks too short.';
      if (!payment.expiry.trim()) e.expiry = 'Expiry is required (MM/YY).';
      if (!payment.cvv.trim()) e.cvv = 'CVV is required.';
      else if (payment.cvv.length < 3) e.cvv = 'CVV looks too short.';
    }

    return e;
  }, [selectedFlight, selectedSeat, passenger, contact, payment]);

  const isFormValid = Object.keys(errors).length === 0;

  function markTouched(name) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function showError(name) {
    return touched[name] && errors[name];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');

    // mark all as touched to show errors
    setTouched({
      fullName: true,
      dob: true,
      passport: true,
      email: true,
      phone: true,
      promoCode: true,
      cardName: true,
      cardNumber: true,
      expiry: true,
      cvv: true,
    });

    if (!isFormValid) return;

    try {
      setStatus('loading');

      // ✅ IMPORTANT: backend expects seatCode, not seat
      const payload = {
        flightId: selectedFlight.id,
        seatCode: selectedSeat,
        passenger: {
          fullName: passenger.fullName,
          dob: passenger.dob,
          passport: passenger.passport?.trim() || '',
        },
        contact: {
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },
        promoCode: promoCode.trim(),
        payment:
          payment.method === 'card'
            ? {
                method: 'card',
                last4: payment.cardNumber.replace(/\s/g, '').slice(-4),
              }
            : { method: 'paypal' },
        total: finalTotal,
      };

      await createBooking(payload);

      navigate('/bookings');
    } catch (err) {
      setSubmitError(err?.message || 'Booking failed.');
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className="p-6 border rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="mt-1 text-sm text-gray-600">Controlled form + validation (mock payment).</p>
        </div>
        <Link to="/search" className="px-3 py-2 rounded-md border hover:bg-gray-50">
          Back to Search
        </Link>
      </div>

      {/* Flight summary */}
      <div className="mt-5 p-4 border rounded-xl bg-gray-50">
        <div className="text-sm text-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">
              {selectedFlight
                ? `${selectedFlight.from} → ${selectedFlight.to} (${selectedFlight.id})`
                : 'No flight selected'}
            </span>
            <span className="text-gray-600">Seat: {selectedSeat || '—'}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-gray-600">
              Base: <span className="font-semibold">${base}</span>
              {discountRate > 0 ? (
                <>
                  {' '}
                  • Discount ({Math.round(discountRate * 100)}%): -${discountAmount}
                </>
              ) : null}
            </span>
            <span className="font-semibold">Total: ${finalTotal}</span>
          </div>

          {errors.flow ? <p className="mt-2 text-sm text-red-700">{errors.flow}</p> : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6">
        {/* Passenger */}
        <section className="border rounded-xl p-4">
          <h2 className="text-lg font-semibold">Passenger details</h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="text-sm">
              Full name
              <input
                value={passenger.fullName}
                onChange={(e) => setPassenger((p) => ({ ...p, fullName: e.target.value }))}
                onBlur={() => markTouched('fullName')}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="Abhai Pedapaga"
              />
              {showError('fullName') ? <p className="mt-1 text-xs text-red-700">{errors.fullName}</p> : null}
            </label>

            <label className="text-sm">
              Date of birth
              <input
                type="date"
                value={passenger.dob}
                onChange={(e) => setPassenger((p) => ({ ...p, dob: e.target.value }))}
                onBlur={() => markTouched('dob')}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
              {showError('dob') ? <p className="mt-1 text-xs text-red-700">{errors.dob}</p> : null}
            </label>

            <label className="text-sm">
              Passport (optional)
              <input
                value={passenger.passport}
                onChange={(e) => setPassenger((p) => ({ ...p, passport: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="A1234567"
              />
            </label>
          </div>
        </section>

        {/* Contact */}
        <section className="border rounded-xl p-4">
          <h2 className="text-lg font-semibold">Contact info</h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm">
              Email
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                onBlur={() => markTouched('email')}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="you@example.com"
              />
              {showError('email') ? <p className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
            </label>

            <label className="text-sm">
              Phone
              <input
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                onBlur={() => markTouched('phone')}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="+1 315 555 1234"
              />
              {showError('phone') ? <p className="mt-1 text-xs text-red-700">{errors.phone}</p> : null}
            </label>
          </div>
        </section>

        {/* Promo */}
        <section className="border rounded-xl p-4">
          <h2 className="text-lg font-semibold">Promo code</h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <label className="text-sm sm:col-span-2">
              Code
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                onBlur={() => markTouched('promoCode')}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="SAVE10"
              />
              <p className="mt-1 text-xs text-gray-600">Try: SAVE10 or STUDENT5</p>
            </label>

            <div className="text-sm">
              <div className="p-3 border rounded-xl bg-gray-50">
                Discount: <span className="font-semibold">{Math.round(discountRate * 100)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="border rounded-xl p-4">
          <h2 className="text-lg font-semibold">Payment</h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm">
              Method
              <select
                value={payment.method}
                onChange={(e) => setPayment((p) => ({ ...p, method: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="card">Card</option>
                <option value="paypal">PayPal (mock)</option>
              </select>
            </label>

            {payment.method === 'paypal' ? (
              <div className="text-sm text-gray-600 flex items-end">
                PayPal selected — mock checkout
              </div>
            ) : (
              <div />
            )}

            {payment.method === 'card' ? (
              <>
                <label className="text-sm">
                  Name on card
                  <input
                    value={payment.cardName}
                    onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))}
                    onBlur={() => markTouched('cardName')}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Abhai Pedapaga"
                  />
                  {showError('cardName') ? <p className="mt-1 text-xs text-red-700">{errors.cardName}</p> : null}
                </label>

                <label className="text-sm">
                  Card number
                  <input
                    value={payment.cardNumber}
                    onChange={(e) => setPayment((p) => ({ ...p, cardNumber: e.target.value }))}
                    onBlur={() => markTouched('cardNumber')}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="4242 4242 4242 4242"
                  />
                  {showError('cardNumber') ? <p className="mt-1 text-xs text-red-700">{errors.cardNumber}</p> : null}
                </label>

                <label className="text-sm">
                  Expiry (MM/YY)
                  <input
                    value={payment.expiry}
                    onChange={(e) => setPayment((p) => ({ ...p, expiry: e.target.value }))}
                    onBlur={() => markTouched('expiry')}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="12/29"
                  />
                  {showError('expiry') ? <p className="mt-1 text-xs text-red-700">{errors.expiry}</p> : null}
                </label>

                <label className="text-sm">
                  CVV
                  <input
                    value={payment.cvv}
                    onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value }))}
                    onBlur={() => markTouched('cvv')}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="123"
                    maxLength={4}
                  />
                  {showError('cvv') ? <p className="mt-1 text-xs text-red-700">{errors.cvv}</p> : null}
                </label>
              </>
            ) : null}
          </div>
        </section>

        {/* Submit */}
        <section className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            disabled={status === 'loading' || !selectedFlight?.id || !selectedSeat}
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            Confirm Booking
          </button>

          <Link to="/bookings" className="px-4 py-2 rounded-md border hover:bg-gray-50">
            View Bookings
          </Link>
        </section>

        {status === 'loading' && <Loading label="Creating booking..." />}
        {submitError && <ErrorState message={submitError} />}

        {!isFormValid && Object.keys(touched).length > 0 ? (
          <p className="text-sm text-red-700">Please fix the highlighted errors above.</p>
        ) : null}
      </form>
    </div>
  );
}
