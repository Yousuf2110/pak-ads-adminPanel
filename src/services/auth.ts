import api from '../lib/api';

export type LoginResponse = { token: string };
export type MeResponse = { id: string; name: string; email: string; role?: string };

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  return (data as any)?.data ?? data;
}

export async function me() {
  const { data } = await api.get<MeResponse>('/auth/me');
  return (data as any)?.data ?? data;
}

export async function logout() {
  try {
    await api.get('/auth/logout');
  } catch {}
}
