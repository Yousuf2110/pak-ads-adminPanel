import api from '../lib/api';

let lastListBasePath: string | null = null;

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
  const endpoints = [
    // pak-ads-be backend: admin-wide list
    '/deposits/admin/all',
    // fallbacks/other namespaces
    '/admin/deposits',
    '/deposits',
    '/wallet/deposits',
    '/payments/deposits',
    '/transactions/deposits',
  ];
  let payload: any = [];
  let lastErr: any = null;
  for (const path of endpoints) {
    try {
      const { data } = await api.get(path);
      payload = (data as any)?.data ?? data;
      lastListBasePath = path; // remember which namespace worked
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.deposits)
    ? payload.deposits
    : [];
  return (list as any[]).map((item) => ({
    id: item.id ?? item._id,
    user: item.user || { name: item.user_name, email: item.user_email },
    amount:
      typeof item.amountUSD === 'number'
        ? item.amountUSD
        : typeof item.amount_usd === 'number'
        ? item.amount_usd
        : typeof item.amount === 'number'
        ? item.amount
        : typeof item.amountPKR === 'number'
        ? Number(item.amountPKR) / 283
        : undefined,
    status: item.status || item.state || item.approval_status,
    proofUrl: item.proofImageUrl || item.proof_url || item.proofImageURL || item.proof,
    createdAt: item.createdAt || item.created_at || item.date,
  })) as Deposit[];
}

export async function getOne(id: string | number) {
  const endpoints = [
    // pak-ads-be backend
    `/deposits/${id}`,
    // fallbacks/other namespaces
    `/admin/deposits/${id}`,
    `/wallet/deposits/${id}`,
    `/payments/deposits/${id}`,
    `/transactions/deposits/${id}`,
  ];
  let detail: any = null;
  let lastErr: any = null;
  for (const path of endpoints) {
    try {
      const { data } = await api.get(path);
      detail = (data as any)?.data ?? data;
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!detail) throw lastErr;
  return {
    id: detail?.id ?? detail?._id,
    user: detail?.user || { name: detail?.user_name, email: detail?.user_email },
    amount:
      typeof detail?.amountUSD === 'number'
        ? detail?.amountUSD
        : typeof detail?.amount_usd === 'number'
        ? detail?.amount_usd
        : typeof detail?.amount === 'number'
        ? detail?.amount
        : typeof detail?.amountPKR === 'number'
        ? Number(detail?.amountPKR) / 283
        : undefined,
    status: detail?.status || detail?.state || detail?.approval_status,
    proofUrl: detail?.proofImageUrl || detail?.proof_url || detail?.proofImageURL || detail?.proof,
    createdAt: detail?.createdAt || detail?.created_at || detail?.date,
  } as Deposit;
}

export async function approve(id: string | number) {
  // Try a few common backend patterns for approval
  const envApprove = (import.meta as any).env?.VITE_ADMIN_DEPOSIT_APPROVE as string | undefined;
  const expand = (tpl?: string) => (tpl ? tpl.replace(/:id/g, String(id)) : undefined);
  const envUrl = expand(envApprove);
  const attempts: Array<() => Promise<any>> = [
    // Exact backend route
    () => api.put(`/deposits/${id}/approve`),
    // Env override (if provided)
    ...(envUrl ? [() => api.put(envUrl), () => api.post(envUrl)] : []),
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
  const envReject = (import.meta as any).env?.VITE_ADMIN_DEPOSIT_REJECT as string | undefined;
  const expand = (tpl?: string) => (tpl ? tpl.replace(/:id/g, String(id)) : undefined);
  const envUrl = expand(envReject);
  const attempts: Array<() => Promise<any>> = [
    // Exact backend route
    () => api.put(`/deposits/${id}/reject`, { reason: 'Rejected by admin' }),
    // Env override
    ...(envUrl ? [() => api.put(envUrl, { reason: 'Rejected by admin' }), () => api.post(envUrl, { reason: 'Rejected by admin' })] : []),
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
  const endpoints = [
    '/deposits/admin/stats',
    '/admin/deposits/stats',
  ];
  for (const path of endpoints) {
    try {
      const { data } = await api.get<DepositStats>(path);
      return (data as any)?.data ?? data;
    } catch {}
  }
  try {
    const list = await listAll();
    const stats: DepositStats = {
      totalDeposits: list.length,
      byStatus: {
        pending: { count: list.filter((d) => d.status === 'pending').length },
        approved: { count: list.filter((d) => d.status === 'approved').length },
        rejected: { count: list.filter((d) => d.status === 'rejected').length },
      },
    };
    return stats;
  } catch {
    return {} as any;
  }
}

