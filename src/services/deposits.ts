import api from '../lib/api';

let lastListBasePath: string | null = null;

export type Deposit = {
  id: string | number;
  user?: { id?: string | number; name?: string; email?: string; phone?: string; referralCode?: string };
  amount?: number;
  status?: 'pending' | 'approved' | 'rejected' | string;
  proofUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  description?: string;
  approvedBy?: string | number | null;
  rejectedBy?: string | number | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
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
    '/deposits/admin/all',
    '/admin/deposits',
    '/deposits',
    '/wallet/deposits',
    '/payments/deposits',
    '/transactions/deposits',
  ];
  let payload: any = null;
  let lastErr: any = null;
  for (const path of endpoints) {
    try {
      const { data } = await api.get(path);
      payload = (data as any)?.data ?? data;
      lastListBasePath = path;
      break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!payload && lastErr) throw lastErr;
  const list: any[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.deposits)
    ? payload.deposits
    : Array.isArray(payload?.items)
    ? payload.items
    : [];
  return list.map((item) => ({
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
    updatedAt: item.updatedAt || item.updated_at,
    paymentMethod: item.paymentMethod || item.method || item.payment_method,
    transactionId: item.transactionId || item.txid || item.transaction_id,
    description: item.description || item.note || item.notes,
    approvedBy: item.approvedBy ?? item.approved_by ?? null,
    rejectedBy: item.rejectedBy ?? item.rejected_by ?? null,
    approvedAt: item.approvedAt || item.approved_at || null,
    rejectedAt: item.rejectedAt || item.rejected_at || null,
  })) as Deposit[];
}

export async function listPaginated(page = 1, limit = 10) {
  const buildUrl = (base: string) => {
    const tmp = new URL(base, 'http://x');
    const path = tmp.pathname + tmp.search;
    const hasQuery = path.includes('?');
    return `${path}${hasQuery ? '&' : '?'}page=${page}&limit=${limit}`;
  };
  const candidates = lastListBasePath
    ? [lastListBasePath]
    : ['/deposits/admin/all', '/admin/deposits', '/deposits', '/wallet/deposits', '/payments/deposits', '/transactions/deposits'];
  let payload: any = null;
  let baseUsed: string | null = null;
  let lastErr: any = null;
  for (const base of candidates) {
    try {
      const url = buildUrl(base);
      const { data } = await api.get(url);
      payload = (data as any)?.data ?? data;
      baseUsed = base;
      break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!payload && lastErr) throw lastErr;
  if (baseUsed) lastListBasePath = baseUsed;
  const items: any[] = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.deposits)
    ? payload.deposits
    : Array.isArray(payload)
    ? payload
    : [];
  const meta = {
    page: Number(payload?.page || payload?.currentPage || page) || page,
    pages: Number(payload?.pages || payload?.totalPages || 1) || 1,
    total: Number(payload?.total || payload?.totalRecords || items.length) || items.length,
    limit: Number(payload?.limit || limit) || limit,
  };
  const normalized = items.map((item: any) => ({
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
    updatedAt: item.updatedAt || item.updated_at,
    paymentMethod: item.paymentMethod || item.method || item.payment_method,
    transactionId: item.transactionId || item.txid || item.transaction_id,
    description: item.description || item.note || item.notes,
    approvedBy: item.approvedBy ?? item.approved_by ?? null,
    rejectedBy: item.rejectedBy ?? item.rejected_by ?? null,
    approvedAt: item.approvedAt || item.approved_at || null,
    rejectedAt: item.rejectedAt || item.rejected_at || null,
  })) as Deposit[];
  return { items: normalized, ...meta };
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
    updatedAt: detail?.updatedAt || detail?.updated_at,
    paymentMethod: detail?.paymentMethod || detail?.method || detail?.payment_method,
    transactionId: detail?.transactionId || detail?.txid || detail?.transaction_id,
    description: detail?.description || detail?.note || detail?.notes,
    approvedBy: detail?.approvedBy ?? detail?.approved_by ?? null,
    rejectedBy: detail?.rejectedBy ?? detail?.rejected_by ?? null,
    approvedAt: detail?.approvedAt || detail?.approved_at || null,
    rejectedAt: detail?.rejectedAt || detail?.rejected_at || null,
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

