import axios from 'axios';

import { get_persisted_auth_token } from './authStorage.js';

const API_ORIGIN = (import.meta.env.AI_CLOUD_URL ?? '').replace(/\/$/, '');
const AI_URL = API_ORIGIN ? `${API_ORIGIN}/ai` : '/ai';

const aiClient = () => {
  const client = axios.create({
    baseURL: AI_URL,
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

export default aiClient;
