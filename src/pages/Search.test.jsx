import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import searchReducer from '../features/search/searchSlice';
import bookingReducer from '../features/booking/bookingSlice';
import authReducer from '../features/auth/authSlice';
import Search from './Search';

vi.mock('../services/flights', () => ({
  searchFlights: vi.fn(),
}));

import { searchFlights } from '../services/flights';

function renderWithStore() {
  const store = configureStore({
    reducer: { search: searchReducer, booking: bookingReducer, auth: authReducer },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    </Provider>
  );
}

test('Search page shows flight results', async () => {
  searchFlights.mockResolvedValueOnce([
    { id: 'AA123', from: 'JFK', to: 'LAX', airline: 'AA', duration: '6h', price: 300 },
  ]);

  renderWithStore();

  expect(await screen.findByText(/JFK → LAX/i)).toBeInTheDocument();
  expect(screen.getByText(/AA123/i)).toBeInTheDocument();
  expect(screen.getByText(/\$300/i)).toBeInTheDocument();
});
