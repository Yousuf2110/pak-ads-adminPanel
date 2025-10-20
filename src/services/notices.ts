import api from '../lib/api';

export type Notice = {
  id: string | number;
  type?: 'general' | 'phone' | string;
  title?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high' | string;
  isActive?: boolean;
  createdDate?: string;
};

export async function listAll() {
  const { data } = await api.get<Notice[]>('/notices');
  return (data as any)?.data ?? data;
}

export async function getOne(id: string | number) {
  const { data } = await api.get<Notice>(`/notices/${id}`);
  return (data as any)?.data ?? data;
}

export async function create(payload: Partial<Notice>) {
  const { data } = await api.post('/notices', payload);
  return (data as any)?.data ?? data;
}

export async function update(id: string | number, payload: Partial<Notice>) {
  const { data } = await api.put(`/notices/${id}`, payload);
  return (data as any)?.data ?? data;
}

export async function remove(id: string | number) {
  const { data } = await api.delete(`/notices/${id}`);
  return (data as any)?.data ?? data;
}

export async function listActive() {
  const { data } = await api.get<Notice[]>('/notices/active');
  return (data as any)?.data ?? data;
}
