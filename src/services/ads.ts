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
  const { data } = await api.get('/ads');
  const payload: any = (data as any)?.data ?? data;
  const list: any[] = Array.isArray(payload) ? payload : (Array.isArray(payload?.rows) ? payload.rows : payload);
  return (list as any[]).map((a) => {
    const primaryImage = Array.isArray(a.images) && a.images.length > 0 ? a.images[0] : null;
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      imageUrl: a.imageUrl || a.image_url || primaryImage?.image_url || primaryImage?.thumbnail_url,
      link: a.link || a.external_url || a.url,
      status: a.status,
      placement: a.placement || a.position || a.ad_placement,
      views: typeof a.views === 'number' ? a.views : (typeof a.views_count === 'number' ? a.views_count : undefined),
      clicks: typeof a.clicks === 'number' ? a.clicks : (typeof a.clicks_count === 'number' ? a.clicks_count : undefined),
      createdAt: a.createdAt || a.created_at,
    } as Ad;
  });
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
  const body: any = {
    title: payload.title,
    description: payload.description,
    external_url: payload.link,
    placement: payload.placement,
  };
  if (payload.imageUrl) {
    body.images = [{ image_url: payload.imageUrl }];
  }
  const { data } = await api.post('/ads', body);
  return (data as any)?.data ?? data;
}

export async function updateAd(id: string | number, payload: Partial<Ad>) {
  const body: any = {
    title: payload.title,
    description: payload.description,
    external_url: payload.link,
    placement: payload.placement,
  };
  if (payload.imageUrl) {
    body.images = [{ image_url: payload.imageUrl }];
  }
  const { data } = await api.put(`/ads/${id}`, body);
  return (data as any)?.data ?? data;
}

export async function deleteAd(id: string | number) {
  const { data } = await api.delete(`/ads/${id}`);
  return (data as any)?.data ?? data;
}

