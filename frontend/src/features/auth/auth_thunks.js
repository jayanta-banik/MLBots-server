import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetch_current_user, login_user, signup_user } from '../../utils/api_client.js';

const AUTH_TOKEN_KEY = 'mlbots.auth.token';

function persist_token(token) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clear_token() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function get_persisted_token() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export const bootstrap_auth = createAsyncThunk('auth/bootstrap', async (_, thunkApi) => {
  const token = get_persisted_token();

  if (!token) {
    return {
      token: null,
      user: null,
    };
  }

  try {
    const user = await fetch_current_user(token);

    return {
      token,
      user,
    };
  } catch (error) {
    clear_token();
    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unable to restore the current session.');
  }
});

export const login = createAsyncThunk('auth/login', async (payload, thunkApi) => {
  try {
    const response = await login_user(payload);

    persist_token(response.token);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unable to sign in.');
  }
});

export const signup = createAsyncThunk('auth/signup', async (payload, thunkApi) => {
  try {
    const response = await signup_user(payload);

    persist_token(response.token);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unable to create the account.');
  }
});

export function logout_local() {
  clear_token();
}
