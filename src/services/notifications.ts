import api from '../lib/api';

export type AdminNotification = {
  id: number | string;
  message: string;
  memberName: string;
  email?: string;
  phone?: string;
  loginTime?: string;
  location?: string;
  time?: string;
  isNew?: boolean;
  type?: 'login' | 'signup' | 'withdrawal' | 'deposit' | string;
};

export async function getAdminNotifications() {
  const { data } = await api.get<AdminNotification[] | { items: AdminNotification[] }>(
    '/notifications/admin'
  );
  const payload: any = (data as any)?.data ?? data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray((payload as any)?.items)) return (payload as any).items;
  return [];
}
