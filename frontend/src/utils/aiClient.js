import axios from 'axios';

const API_ORIGIN = (import.meta.env.AI_CLOUD_URL ?? '').replace(/\/$/, '');
const AI_URL = API_ORIGIN ? `${API_ORIGIN}/ai` : '/ai';

const aiClient = () =>
  axios.create({
    baseURL: AI_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${window.sessionStorage.getItem('wrongToken') ?? window.localStorage.getItem('mlbots.auth.token') ?? ''}`,
    },
  });

export default aiClient;
