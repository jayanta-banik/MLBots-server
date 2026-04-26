import axios from 'axios';

const API_ORIGIN = (import.meta.env.VITE_CLOUD_URL ?? '').replace(/\/$/, '');
const API_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

const apiClient = () => axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${window.sessionStorage.getItem('wrongToken') ?? window.localStorage.getItem('mlbots.auth.token') ?? ''}`,
  },
});

export default apiClient;
