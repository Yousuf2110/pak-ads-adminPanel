import api from '../lib/api';

export type Location = { id: number | string; name: string };

export async function listLocations() {
  const { data } = await api.get('/locations');
  const payload: any = (data as any)?.data ?? data;
  const list: any[] = Array.isArray(payload) ? payload : (Array.isArray(payload?.rows) ? payload.rows : []);
  return list.map((c: any) => ({ id: c.id, name: c.name })) as Location[];
}
