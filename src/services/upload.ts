import api from '../lib/api';

export type UploadResponse = {
  url?: string;
  filename?: string;
};

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post<UploadResponse>('/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (data as any)?.data ?? data;
}

export async function deleteImage(filename: string) {
  const { data } = await api.delete(`/upload/${encodeURIComponent(filename)}`);
  return (data as any)?.data ?? data;
}
