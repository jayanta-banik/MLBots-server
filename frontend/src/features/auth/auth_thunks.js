import { createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../../utils/apiClient.js';

const AUTH_TOKEN_KEY = 'mlbots.auth.token';
const SESSION_AUTH_TOKEN_KEY = 'wrongToken';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function build_login_payload({ identifier, password }) {
  const trimmedIdentifier = identifier.trim();

  return EMAIL_PATTERN.test(trimmedIdentifier) ? { email: trimmedIdentifier.toLowerCase(), password } : { password, username: trimmedIdentifier };
}

function persist_token(token) {
  if (!token) {
    clear_token();
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, token);
}

function clear_token() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(SESSION_AUTH_TOKEN_KEY);
}

export function get_persisted_token() {
  const sessionToken = window.sessionStorage.getItem(SESSION_AUTH_TOKEN_KEY);

  if (sessionToken) {
    return sessionToken;
  }

  const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY);

  if (localToken) {
    window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, localToken);
  }

  return localToken;
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
    window.sessionStorage.setItem(SESSION_AUTH_TOKEN_KEY, token);
    const response = await apiClient().get('/users/me');
    const user = response.data;

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
    const response = await apiClient().post('/auth/login', build_login_payload(payload));
    const token = response.data.token;

    persist_token(token);

    const userResponse = await apiClient().get('/users/me');

    return {
      token,
      user: userResponse.data,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message ?? 'Unable to sign in.');
  }
});

export const signup = createAsyncThunk('auth/signup', async (payload, thunkApi) => {
  try {
    const response = await apiClient().post('/auth/signup', payload);

    persist_token(response.data.token);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message ?? 'Unable to create the account.');
  }
});

export async function check_username_availability(username) {
  const response = await apiClient().get('/auth/username-availability', {
    params: {
      username,
    },
  });

  return response.data;
}

export function logout_local() {
  clear_token();
}
