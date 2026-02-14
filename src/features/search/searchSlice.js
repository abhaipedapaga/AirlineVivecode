import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  params: { from: 'JFK', to: '' },
  results: [],
  filters: {},
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams(state, action) {
      state.params = { ...state.params, ...action.payload };
    },
    setSearchResults(state, action) {
      state.results = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearch(state) {
      state.results = [];
    },
  },
});

export const { setSearchParams, setSearchResults, setFilters, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
