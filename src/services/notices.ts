import api from '../lib/api';

export type Notice = {
  id: string | number;
  type?: 'general' | 'phone' | string;
  title?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high' | string;
  isActive?: boolean;
  createdDate?: string;
};

export async function listAll() {
  const { data } = await api.get('/notices');
  const payload: any = (data as any)?.data ?? data;
  const list: any[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.notices)
    ? payload.notices
    : [];
  return list.map((n: any) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    content: n.content,
    // backend default priority can be 'normal'; keep value as-is to preserve ordering on server
    priority: n.priority,
    isActive: (n.status || '').toLowerCase() === 'active',
    createdDate: n.created_at || n.createdAt,
  })) as Notice[];
}

export async function getOne(id: string | number) {
  const { data } = await api.get<Notice>(`/notices/${id}`);
  return (data as any)?.data ?? data;
}

export async function create(payload: Partial<Notice>) {
  const body: any = {
    title: payload.title,
    content: payload.content,
    type: payload.type || 'general',
    // send priority as-is; backend accepts arbitrary string and defaults to 'normal'
    priority: payload.priority,
    status: payload.isActive === false ? 'inactive' : 'active',
  };
  const { data } = await api.post('/notices', body);
  return (data as any)?.data ?? data;
}

export async function update(id: string | number, payload: Partial<Notice>) {
  const body: any = {
    title: payload.title,
    content: payload.content,
    type: payload.type,
    priority: payload.priority,
    status: payload.isActive === undefined ? undefined : (payload.isActive ? 'active' : 'inactive'),
  };
  Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);
  const { data } = await api.put(`/notices/${id}`, body);
  return (data as any)?.data ?? data;
}

export async function remove(id: string | number) {
  const { data } = await api.delete(`/notices/${id}`);
  return (data as any)?.data ?? data;
}

export async function listActive() {
  const { data } = await api.get<Notice[]>('/notices/active');
  return (data as any)?.data ?? data;
}

