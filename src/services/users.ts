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

export async function listUsers(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  const { data } = await api.get(`/users${qs ? `?${qs}` : ''}`);
  const payload: any = (data as any)?.data ?? data;
  const meta = {
    page: (data as any)?.page ?? (payload?.page ?? params?.page ?? 1),
    pages: (data as any)?.pages ?? (payload?.pages ?? 1),
    total: (data as any)?.total ?? (payload?.total ?? (Array.isArray(payload) ? payload.length : 0)),
  };
  const list: any[] = Array.isArray(payload) ? payload : (Array.isArray(payload?.rows) ? payload.rows : (Array.isArray(payload?.data) ? payload.data : []));
  const users = (list as any[]).map((u) => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    status: u.is_active === true ? 'active' : 'inactive',
    verified: u.is_email_verified === true,
    balance: typeof u.wallet_balance === 'number' ? u.wallet_balance : (u.wallet_balance ? parseFloat(u.wallet_balance) : undefined),
    referralsCount: typeof u.total_referrals === 'number' ? u.total_referrals : undefined,
    totalEarned: typeof u.total_earnings === 'number' ? u.total_earnings : (typeof u.earnings_total === 'number' ? u.earnings_total : undefined),
    createdAt: u.created_at || u.createdAt,
  })) as User[];
  return { users, ...meta };
}

export async function getUser(id: string) {
  const { data } = await api.get(`/users/${id}`);
  const u: any = (data as any)?.data ?? data;
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    status: u.is_active === true ? 'active' : 'inactive',
    verified: u.is_email_verified === true,
    balance: typeof u.wallet_balance === 'number' ? u.wallet_balance : (u.wallet_balance ? parseFloat(u.wallet_balance) : undefined),
    referralsCount: typeof u.total_referrals === 'number' ? u.total_referrals : undefined,
    totalEarned: typeof u.total_earnings === 'number' ? u.total_earnings : (typeof u.earnings_total === 'number' ? u.earnings_total : undefined),
    createdAt: u.created_at || u.createdAt,
  } as User;
}

export async function updateUser(id: string, payload: Partial<User>) {
  const { data } = await api.put(`/users/${id}`, payload);
  return (data as any)?.data ?? data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/users/${id}`);
  return (data as any)?.data ?? data;
}
