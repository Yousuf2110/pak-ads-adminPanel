import axios, { AxiosError } from 'axios';

// Use relative base by default to leverage Vite proxy in development.
// In production, set VITE_API_BASE_URL to your backend origin.
const isDev = import.meta.env.DEV;
const rawBase = isDev ? '' : ((import.meta.env.VITE_API_BASE_URL as string) || '');
const baseUrl = (rawBase || '').replace(/\/+$/, '');
const apiVersion = (import.meta.env.VITE_API_VERSION as string) || 'v1';

export const api = axios.create({
  baseURL: `${baseUrl}/api/${apiVersion}`,
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
