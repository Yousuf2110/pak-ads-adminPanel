import api from '../lib/api';

export type TopEarner = {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  points?: number;
  referrals?: number;
  bonus?: number;
};

export async function getOverallStats() {
  const { data } = await api.get('/commissions/admin/overall-stats');
  return (data as any)?.data ?? data;
}

export async function getTopEarners() {
  const { data } = await api.get<TopEarner[]>('/commissions/admin/top-earners');
  return (data as any)?.data ?? data;
}

export async function getUserAdmin(userId: string) {
  const { data } = await api.get(`/commissions/admin/user/${userId}`);
  return (data as any)?.data ?? data;
}

export async function distribute(payload: any) {
  const { data } = await api.post('/commissions/distribute', payload);
  return (data as any)?.data ?? data;
}
