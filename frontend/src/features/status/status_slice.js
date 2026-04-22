import { createSlice } from '@reduxjs/toolkit';

import { fetch_service_statuses } from './status_thunks.js';

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    isLoading: true,
    lastUpdatedAt: '',
    loadError: '',
    services: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_service_statuses.pending, (state) => {
        state.isLoading = true;
        state.loadError = '';
      })
      .addCase(fetch_service_statuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastUpdatedAt = action.payload.lastUpdatedAt;
        state.loadError = action.payload.loadError;
        state.services = action.payload.services;
      })
      .addCase(fetch_service_statuses.rejected, (state, action) => {
        state.isLoading = false;
        state.loadError = action.error?.message ?? 'Unable to load service statuses.';
        state.services = [];
      });
  },
});

export default statusSlice.reducer;
