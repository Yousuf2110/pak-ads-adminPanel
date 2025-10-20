import api from '../lib/api';

export type AdminStats = {
  totalUsers?: number;
  verifiedUsers?: number;
  totalWithdrawals?: number;
  totalDeposits?: number;
  pendingRequests?: number;
  dailyRevenue?: number;
};

export async function getAdminStats() {
  const { data } = await api.get<AdminStats>('/dashboard/admin/stats');
  return (data as any)?.data ?? data;
}

export async function getAdminCommissions() {
  const { data } = await api.get('/dashboard/admin/commissions');
  return (data as any)?.data ?? data;
}
