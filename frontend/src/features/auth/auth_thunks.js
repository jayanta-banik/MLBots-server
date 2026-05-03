import { createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../../utils/apiClient.js';
import { clear_auth_token, get_persisted_auth_session, persist_auth_session, persist_auth_token } from '../../utils/authStorage.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LOGIN_MINIMUM_DURATION_MS = 200;

function build_login_payload({ identifier, password }) {
  const trimmedIdentifier = identifier.trim();

  return EMAIL_PATTERN.test(trimmedIdentifier) ? { email: trimmedIdentifier.toLowerCase(), password } : { password, username: trimmedIdentifier };
}

function wait_for_minimum_duration(startedAt, minimumDurationMs) {
  const remainingDuration = minimumDurationMs - (Date.now() - startedAt);

  if (remainingDuration <= 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, remainingDuration);
  });
}

export { persist_auth_token };

export const bootstrap_auth = createAsyncThunk('auth/bootstrap', async (_, thunkApi) => {
  const { token, user: cachedUser } = get_persisted_auth_session();

  if (!token) {
    return {
      token: null,
      user: null,
    };
  }

  try {
    persist_auth_token(token);
    const response = await apiClient().get('/users/me');
    const user = response.data;

    persist_auth_session({ token, user });

    return {
      token,
      user,
    };
  } catch (error) {
    const statusCode = error.response?.status;

    if (statusCode === 401 || statusCode === 403) {
      clear_auth_token();
      return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unable to restore the current session.');
    }

    if (cachedUser) {
      return {
        token,
        user: cachedUser,
      };
    }

    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unable to restore the current session.');
  }
});

export const login = createAsyncThunk('auth/login', async (payload, thunkApi) => {
  const startedAt = Date.now();
  const rememberMe = payload.rememberMe !== false;

  try {
    const response = await apiClient().post('/auth/login', build_login_payload(payload));
    const token = response.data.token;
    const user = response.data.user;

    await wait_for_minimum_duration(startedAt, LOGIN_MINIMUM_DURATION_MS);

    persist_auth_session({ token, user }, { remember: rememberMe });

    return {
      token,
      user,
    };
  } catch (error) {
    await wait_for_minimum_duration(startedAt, LOGIN_MINIMUM_DURATION_MS);
    return thunkApi.rejectWithValue(error.response?.data?.message ?? error.message ?? 'Unable to sign in.');
  }
});

export const signup = createAsyncThunk('auth/signup', async (payload, thunkApi) => {
  try {
    const response = await apiClient().post('/auth/signup', payload);

    persist_auth_token(response.data.token);
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
  clear_auth_token();
}
