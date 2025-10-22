import axios, { AxiosError } from 'axios';

// Use relative base by default to leverage Vite proxy in development.
// In production, set VITE_API_BASE_URL to your backend origin.
const rawBase = (import.meta.env.VITE_API_BASE_URL as string) || 'https://pak-ads-be.vercel.app/api';
const baseUrl = (rawBase || '').replace(/\/+$/, '');

export const api = axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('pakads_admin_token') || localStorage.getItem('pakads_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('pakads_admin_token');
        localStorage.removeItem('pakads_token');
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;
