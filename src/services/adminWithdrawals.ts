import api from '../lib/api';

export type AdminWithdrawal = {
  id: string | number;
  user?: { id?: string; name?: string; email?: string; phone?: string };
  amount?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'sent' | string;
  accountDetails?: string;
  createdAt?: string;
};

export type WithdrawalStats = {
  pending?: number;
  approved?: number;
  rejected?: number;
  sent?: number;
};

export async function listAll() {
  const { data } = await api.get('/admin/withdrawals');
  const payload = (data as any)?.data ?? data;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.withdrawals) ? payload.withdrawals : [];
  return (list as any[]).map((w) => ({
    id: w.id,
    user: w.user,
    amount: typeof w.amount === 'number' ? w.amount : (w.amountUSD ? w.amountUSD : undefined),
    status: w.status,
    accountDetails: w.description || w.accountDetails || undefined,
    createdAt: w.createdAt || w.created_at,
  })) as AdminWithdrawal[];
}

export async function getStats() {
  const { data } = await api.get<WithdrawalStats>('/admin/withdrawals/stats');
  return (data as any)?.data ?? data;
}

export async function approve(id: string | number) {
  const { data } = await api.put(`/admin/withdrawals/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function reject(id: string | number) {
  // Backend requires a reason
  const { data } = await api.put(`/admin/withdrawals/${id}/reject`, { reason: 'Rejected by admin' });
  return (data as any)?.data ?? data;
}

export async function markSent(id: string | number) {
  const { data } = await api.put(`/admin/withdrawals/${id}/sent`);
  return (data as any)?.data ?? data;
}
