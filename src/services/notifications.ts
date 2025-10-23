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
  const { data } = await api.get<any>('/notifications');
  const payload: any = (data as any)?.data ?? data;

  const list: any[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.notifications)
    ? payload.notifications
    : [];

  return list.map((n: any) => ({
    id: n.id ?? n._id ?? `${n.type || 'notification'}-${n.created_at || n.createdAt || ''}`,
    message: n.message || n.title || 'Notification',
    memberName: n.user?.name || n.user_name || n.memberName || undefined,
    email: n.user?.email || n.email,
    phone: n.user?.phone || n.phone,
    loginTime: n.loginTime,
    location: n.location,
    time: n.created_at || n.createdAt || n.time,
    isNew: n.is_read === false || n.isNew === true,
    type: n.type,
  })) as AdminNotification[];
}
