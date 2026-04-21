import { createSlice } from '@reduxjs/toolkit';

import { bootstrap_auth, login, logout_local, signup } from './auth_thunks.js';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    error: '',
    status: 'idle',
    token: null,
    user: null,
  },
  reducers: {
    clear_auth_error(state) {
      state.error = '';
    },
    logout(state) {
      logout_local();
      state.error = '';
      state.status = 'anonymous';
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrap_auth.pending, (state) => {
        state.error = '';
        state.status = 'loading';
      })
      .addCase(bootstrap_auth.fulfilled, (state, action) => {
        state.error = '';
        state.status = action.payload.token ? 'authenticated' : 'anonymous';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(bootstrap_auth.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to restore the current session.';
        state.status = 'anonymous';
        state.token = null;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.error = '';
        state.status = 'submitting';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.error = '';
        state.status = 'authenticated';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to sign in.';
        state.status = 'anonymous';
      })
      .addCase(signup.pending, (state) => {
        state.error = '';
        state.status = 'submitting';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.error = '';
        state.status = 'authenticated';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload ?? 'Unable to create the account.';
        state.status = 'anonymous';
      });
  },
});

export const { clear_auth_error, logout } = authSlice.actions;

export default authSlice.reducer;
