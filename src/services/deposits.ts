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
  // Admin list endpoint
  const { data } = await api.get('/deposits/admin/list');
  const payload = (data as any)?.data ?? data;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.deposits) ? payload.deposits : [];
  return (list as any[]).map((d) => ({
    id: d.id,
    user: d.user,
    amount: typeof d.amount === 'number' ? d.amount : undefined,
    status: d.status,
    proofUrl: d.proofImageUrl || d.proof_url || d.proofImageURL,
    createdAt: d.createdAt || d.created_at,
  })) as Deposit[];
}

export async function getOne(id: string | number) {
  const { data } = await api.get(`/deposits/admin/${id}`);
  const d = (data as any)?.data ?? data;
  return {
    id: d?.id,
    user: d?.user,
    amount: d?.amount,
    status: d?.status,
    proofUrl: d?.proofImageUrl,
    createdAt: d?.createdAt,
  } as Deposit;
}

export async function approve(id: string | number) {
  const { data } = await api.put(`/deposits/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function reject(id: string | number) {
  const { data } = await api.put(`/deposits/${id}/reject`, { reason: 'Rejected by admin' });
  return (data as any)?.data ?? data;
}
