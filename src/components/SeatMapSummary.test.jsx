import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import bookingReducer, { setSelectedFlight, setSelectedSeat } from '../features/booking/bookingSlice';
import SeatMap from './SeatMap';
import BookingSummary from './BookingSummary';

test('Selecting seat updates BookingSummary', async () => {
  const store = configureStore({ reducer: { booking: bookingReducer } });

  store.dispatch(setSelectedFlight({ id: 'AA123', from: 'JFK', to: 'LAX', price: 300 }));
  store.dispatch(setSelectedSeat(null));

  const seats = [
    { code: '2A', row: 2, col: 'A', status: 'available' },
    { code: '2B', row: 2, col: 'B', status: 'reserved' },
  ];

  render(
    <Provider store={store}>
      <BookingSummary />
      <SeatMap seats={seats} />
    </Provider>
  );

  const user = userEvent.setup();

  // SeatMap has aria-label like: “Seat 2A available”
  await user.click(screen.getByRole('button', { name: /Seat 2A available/i }));

  // BookingSummary should reflect seat
  expect(screen.getByText(/2A/i)).toBeInTheDocument();
});
