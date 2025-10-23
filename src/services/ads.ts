import api from '../lib/api';

export type Ad = {
  id: string | number;
  title?: string;
  description?: string;
  price?: number;
  link?: string;
  status?: string;
  views?: number;
  clicks?: number;
  createdAt?: string;
  category_id?: number | string;
  location_id?: number | string;
};

export async function listAds() {
  const { data } = await api.get('/ads');
  const payload: any = (data as any)?.data ?? data;
  const list: any[] = Array.isArray(payload) ? payload : (Array.isArray(payload?.rows) ? payload.rows : payload);
  const getYoutubeId = (url?: string): string | null => {
    if (!url) return null;
    try {
      const u = new URL(url);
      // youtu.be/VIDEO
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '').trim();
        return id || null;
      }
      // youtube.com/watch?v=VIDEO or other variants
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return id;
        const path = u.pathname || '';
        const parts = path.split('/').filter(Boolean);
        // handle /embed/VIDEO or /shorts/VIDEO
        const idx = parts.findIndex(p => p === 'embed' || p === 'shorts');
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      }
    } catch {}
    return null;
  };
  const ytThumb = (url?: string): string | undefined => {
    const id = getYoutubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
  };
  return (list as any[]).map((a) => {
    const primaryImage = Array.isArray(a.images) && a.images.length > 0 ? a.images[0] : null;
    const rawLink = a.link || a.external_url || a.url;
    const fallbackThumb = ytThumb(rawLink);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      imageUrl: a.imageUrl || a.image_url || primaryImage?.image_url || primaryImage?.thumbnail_url || fallbackThumb,
      link: rawLink,
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
    price: payload.price ?? 0,
    external_url: payload.link,
    category_id: payload.category_id,
    location_id: payload.location_id,
  };
  const { data } = await api.post('/ads', body);
  return (data as any)?.data ?? data;
}

export async function updateAd(id: string | number, payload: Partial<Ad>) {
  const body: any = {
    title: payload.title,
    description: payload.description,
    price: payload.price,
    external_url: payload.link,
    category_id: payload.category_id,
    location_id: payload.location_id,
  };
  const { data } = await api.put(`/ads/${id}`, body);
  return (data as any)?.data ?? data;
}

export async function deleteAd(id: string | number) {
  const { data } = await api.delete(`/ads/${id}`);
  return (data as any)?.data ?? data;
}

