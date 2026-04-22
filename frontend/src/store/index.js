import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/auth_slice.js';
import statusReducer from '../features/status/status_slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    status: statusReducer,
  },
});

export default store;
