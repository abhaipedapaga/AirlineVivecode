import reducer, { setSelectedFlight, setSelectedSeat } from './bookingSlice';

describe('bookingSlice', () => {
  test('setSelectedFlight sets flight and resets seat', () => {
    const start = reducer(undefined, { type: 'init' });

    const withSeat = reducer(start, setSelectedSeat('2A'));
    const next = reducer(withSeat, setSelectedFlight({ id: 'AA123', price: 499 }));

    expect(next.selectedFlight.id).toBe('AA123');
    expect(next.selectedSeat).toBe(null);
    expect(next.totalPrice).toBe(499);
  });

  test('setSelectedSeat updates selectedSeat', () => {
    const start = reducer(undefined, { type: 'init' });
    const next = reducer(start, setSelectedSeat('3C'));
    expect(next.selectedSeat).toBe('3C');
  });
});
