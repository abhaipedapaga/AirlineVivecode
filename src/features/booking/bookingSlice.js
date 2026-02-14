import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedFlight: null,
  selectedSeat: null,
  passengers: [],
  totalPrice: 0,
  seatMap: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedFlight(state, action) {
      const nextFlight = action.payload;

      // reset seat only if switching flights
      if (state.selectedFlight?.id && state.selectedFlight.id !== nextFlight?.id) {
        state.selectedSeat = null;
        state.seatMap = [];
      }

      state.selectedFlight = nextFlight;
      state.totalPrice = nextFlight?.price || 0;
    },

    setSeatMap(state, action) {
      state.seatMap = action.payload || [];
    },

    reserveSeat(state, action) {
      const seatCode = action.payload;

      state.seatMap = state.seatMap.map((s) =>
        s.code === seatCode ? { ...s, status: 'reserved' } : s
      );

      if (state.selectedSeat === seatCode) {
        state.selectedSeat = null;
      }
    },

    updatePrice(state, action) {
      const newPrice = action.payload;

      if (state.selectedFlight) {
        state.selectedFlight.price = newPrice;
      }

      state.totalPrice = newPrice;
    },

    setSelectedSeat(state, action) {
      state.selectedSeat = action.payload;
    },

    setPassengers(state, action) {
      state.passengers = action.payload;
    },

    setTotalPrice(state, action) {
      state.totalPrice = action.payload;
    },

    resetBooking() {
      return initialState;
    },
  },
});

export const {
  setSelectedFlight,
  setSeatMap,
  reserveSeat,
  updatePrice,
  setSelectedSeat,
  setPassengers,
  setTotalPrice,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
