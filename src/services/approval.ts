import api from '../lib/api';

export type ApprovalUser = {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  cnic?: string;
  createdAt?: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
};

export type ApprovalStats = {
  pending?: number;
  approved?: number;
  rejected?: number;
};

export async function listPending() {
  const { data } = await api.get<ApprovalUser[]>('/admin/approval/pending');
  return (data as any)?.data ?? data;
}

export async function listApproved() {
  const { data } = await api.get<ApprovalUser[]>('/admin/approval/approved');
  return (data as any)?.data ?? data;
}

export async function getStats() {
  const { data } = await api.get<ApprovalStats>('/admin/approval/stats');
  return (data as any)?.data ?? data;
}

export async function approve(id: string | number) {
  const { data } = await api.put(`/admin/approval/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function reject(id: string | number) {
  const { data } = await api.put(`/admin/approval/${id}/reject`);
  return (data as any)?.data ?? data;
}
