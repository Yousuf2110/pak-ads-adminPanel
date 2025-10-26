import api from '../lib/api';

export type Deposit = {
  id: string | number;
  user?: { id?: string; name?: string; email?: string };
  amount?: number;
  status?: 'pending' | 'approved' | 'rejected' | string;
  proofUrl?: string;
  createdAt?: string;
};

export type DepositStats = {
  totalDeposits?: number;
  totalAmount?: number;
  totalAmountUSD?: number;
  byStatus?: {
    pending?: { count?: number; amount?: number; amountUSD?: number };
    approved?: { count?: number; amount?: number; amountUSD?: number };
    rejected?: { count?: number; amount?: number; amountUSD?: number };
  };
};

export async function listAll() {
  const { data } = await api.get('/deposits');
  const payload = (data as any)?.data ?? data;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.deposits)
    ? payload.deposits
    : [];
  return (list as any[]).map((item) => ({
    id: item.id,
    user: item.user,
    amount: typeof item.amountUSD === 'number' ? item.amountUSD : (typeof item.amount === 'number' ? item.amount : undefined),
    status: item.status,
    proofUrl: item.proofImageUrl || item.proof_url || item.proofImageURL,
    createdAt: item.createdAt || item.created_at,
  })) as Deposit[];
}

export async function getOne(id: string | number) {
  const { data } = await api.get(`/deposits/${id}`);
  const detail = (data as any)?.data ?? data;
  return {
    id: detail?.id,
    user: detail?.user,
    amount: typeof detail?.amountUSD === 'number' ? detail?.amountUSD : detail?.amount,
    status: detail?.status,
    proofUrl: detail?.proofImageUrl,
    createdAt: detail?.createdAt,
  } as Deposit;
}

export async function approve(id: string | number) {
  // Try a few common backend patterns for approval
  const attempts: Array<() => Promise<any>> = [
    () => api.put(`/deposits/${id}/approve`),
    () => api.put(`/deposits/${id}/approve`, { approved: true }),
    () => api.put(`/deposits/${id}/approve`, { action: 'approve' }),
    () => api.post(`/deposits/${id}/approve`),
    () => api.post(`/deposits/${id}/approve`, { approved: true }),
    () => api.post(`/deposits/${id}/approve`, { action: 'approve' }),
    () => api.put(`/admin/deposits/${id}/approve`),
    () => api.put(`/admin/deposits/${id}/approve`, { approved: true }),
    () => api.put(`/admin/deposits/${id}/approve`, { action: 'approve' }),
    () => api.post(`/admin/deposits/${id}/approve`),
    () => api.post(`/admin/deposits/${id}/approve`, { approved: true }),
    () => api.post(`/admin/deposits/${id}/approve`, { action: 'approve' }),
    () => api.put(`/deposits/${id}/status`, { status: 'approved' }),
    () => api.put(`/admin/deposits/${id}/status`, { status: 'approved' }),
  ];
  let lastErr: any = null;
  for (const fn of attempts) {
    try {
      const { data } = await fn();
      return (data as any)?.data ?? data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function reject(id: string | number) {
  const attempts: Array<() => Promise<any>> = [
    () => api.put(`/deposits/${id}/reject`, { reason: 'Rejected by admin' }),
    () => api.post(`/deposits/${id}/reject`, { reason: 'Rejected by admin' }),
    () => api.put(`/admin/deposits/${id}/reject`, { reason: 'Rejected by admin' }),
    () => api.post(`/admin/deposits/${id}/reject`, { reason: 'Rejected by admin' }),
    () => api.put(`/deposits/${id}/status`, { status: 'rejected', reason: 'Rejected by admin' }),
    () => api.put(`/admin/deposits/${id}/status`, { status: 'rejected', reason: 'Rejected by admin' }),
  ];
  let lastErr: any = null;
  for (const fn of attempts) {
    try {
      const { data } = await fn();
      return (data as any)?.data ?? data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function getStats() {
  const { data } = await api.get<DepositStats>('/deposits/admin/stats');
  return (data as any)?.data ?? data;
}

