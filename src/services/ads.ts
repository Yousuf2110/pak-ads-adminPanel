import api from '../lib/api';

export type Ad = {
  id: string | number;
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  status?: string;
  placement?: string;
  views?: number;
  clicks?: number;
  createdAt?: string;
};

export async function listAds() {
  const { data } = await api.get<Ad[]>('/ads');
  return (data as any)?.data ?? data;
}

export async function approveAd(id: string | number) {
  const { data } = await api.put(`/ads/${id}/approve`);
  return (data as any)?.data ?? data;
}

export async function rejectAd(id: string | number) {
  const { data } = await api.put(`/ads/${id}/reject`);
  return (data as any)?.data ?? data;
}

export async function featureAd(id: string | number) {
  const { data } = await api.put(`/ads/${id}/feature`);
  return (data as any)?.data ?? data;
}

export async function createAd(payload: Partial<Ad>) {
  const { data } = await api.post('/ads', payload);
  return (data as any)?.data ?? data;
}

export async function updateAd(id: string | number, payload: Partial<Ad>) {
  const { data } = await api.put(`/ads/${id}`, payload);
  return (data as any)?.data ?? data;
}

export async function deleteAd(id: string | number) {
  const { data } = await api.delete(`/ads/${id}`);
  return (data as any)?.data ?? data;
}

