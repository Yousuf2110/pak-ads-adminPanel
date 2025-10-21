import api from '../lib/api';

export type ApprovalUser = {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  cnic?: string;
  createdAt?: string;
  is_active?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | string;
};

export type ApprovalStats = {
  pending?: number;
  approved?: number;
  rejected?: number;
};

function normalizeUser(u: any, status: 'pending' | 'approved'): ApprovalUser {
  if (!u) return { id: '' } as any;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    // Backend does not expose CNIC; keep optional placeholder if UI expects
    cnic: u.cnic || undefined,
    createdAt: u.created_at || u.createdAt,
    is_active: typeof u.is_active === 'boolean' ? u.is_active : undefined,
    status: status === 'pending' && u.is_active === false ? 'rejected' : status,
  };
}

export async function listPending() {
  const { data } = await api.get('/admin/approval/pending');
  const payload = (data as any)?.data ?? data;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.rows) ? payload.rows : [];
  return list.map((u: any) => normalizeUser(u, 'pending')) as ApprovalUser[];
}

export async function listApproved() {
  const { data } = await api.get('/admin/approval/approved');
  const payload = (data as any)?.data ?? data;
  const list = Array.isArray(payload) ? payload : Array.isArray(payload?.rows) ? payload.rows : [];
  return list.map((u: any) => normalizeUser(u, 'approved')) as ApprovalUser[];
}

export async function getStats() {
  const { data } = await api.get('/admin/approval/stats');
  const d = (data as any)?.data ?? data;
  // Backend returns: totalUsers, pendingUsers, approvedUsers, activeUsers
  return {
    pending: d?.pendingUsers ?? 0,
    approved: d?.approvedUsers ?? 0,
    rejected: 0,
  } as ApprovalStats;
}

export async function approve(id: string | number) {
  const { data } = await api.put(`/admin/approval/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function reject(id: string | number) {
  const { data } = await api.put(`/admin/approval/${id}/reject`);
  return (data as any)?.data ?? data;
}

