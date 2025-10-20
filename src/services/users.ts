import api from '../lib/api';

export type User = {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  verified?: boolean;
  balance?: number;
  referralsCount?: number;
  totalEarned?: number;
  phone?: string;
  createdAt?: string;
};

export async function listUsers() {
  const { data } = await api.get<User[]>('/users');
  return (data as any)?.data ?? data;
}

export async function getUser(id: string) {
  const { data } = await api.get<User>(`/users/${id}`);
  return (data as any)?.data ?? data;
}

export async function updateUser(id: string, payload: Partial<User>) {
  const { data } = await api.put(`/users/${id}`, payload);
  return (data as any)?.data ?? data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/users/${id}`);
  return (data as any)?.data ?? data;
}
