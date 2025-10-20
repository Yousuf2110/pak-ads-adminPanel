import api from '../lib/api';

export type TransferStats = {
  total?: number;
  today?: number;
  month?: number;
};

export async function getAdminStats() {
  const { data } = await api.get<TransferStats>('/transfers/admin/stats');
  return (data as any)?.data ?? data;
}
