import api from '../lib/api';

export type Deposit = {
  id: string | number;
  user?: { id?: string; name?: string; email?: string };
  amount?: number;
  status?: 'pending' | 'approved' | 'rejected' | string;
  proofUrl?: string;
  createdAt?: string;
};

export async function listAll() {
  const { data } = await api.get<Deposit[]>('/deposits');
  return (data as any)?.data ?? data;
}

export async function getOne(id: string | number) {
  const { data } = await api.get<Deposit>(`/deposits/${id}`);
  return (data as any)?.data ?? data;
}

export async function approve(id: string | number) {
  const { data } = await api.put(`/deposits/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function reject(id: string | number) {
  const { data } = await api.put(`/deposits/${id}/reject`);
  return (data as any)?.data ?? data;
}
