import axios from 'axios';

import { get_persisted_auth_token } from './authStorage.js';

const API_ORIGIN = (import.meta.env.VITE_CLOUD_URL ?? '').replace(/\/$/, '');
export const API_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

const apiClient = () => {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = get_persisted_auth_token();
    const headers = config.headers ?? {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      delete headers.Authorization;
    }

    config.headers = headers;
    return config;
  });

  return client;
};

export default apiClient;
