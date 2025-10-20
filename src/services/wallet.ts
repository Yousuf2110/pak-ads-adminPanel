import api from '../lib/api';

export type Withdrawal = {
  id: string | number;
  user?: { id?: string; name?: string; email?: string; phone?: string };
  amount?: number;
  status?: 'pending' | 'sent' | 'rejected' | string;
  accountDetails?: string;
  createdAt?: string;
};

export async function getWithdrawals() {
  const { data } = await api.get<Withdrawal[]>('/wallet/withdrawals');
  const payload: any = (data as any)?.data ?? data;
  return Array.isArray(payload) ? payload : [];
}
