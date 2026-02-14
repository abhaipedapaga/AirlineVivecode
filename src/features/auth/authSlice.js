import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'airline_token_v1';
const USER_KEY = 'airline_user_v1';

function loadAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    return { token: token || null, user: user || null, isLoggedIn: Boolean(token) };
  } catch {
    return { token: null, user: null, isLoggedIn: false };
  }
}

const initialState = loadAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
