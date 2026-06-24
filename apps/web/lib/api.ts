import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("inkspire_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await apiClient.get<{ success: boolean; data: T }>(path);
  return res.data.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await apiClient.post<{ success: boolean; data: T }>(path, body);
  return res.data.data as T;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiClient.patch<{ success: boolean; data: T }>(path, body);
  return res.data.data as T;
}

export async function apiDelete(path: string): Promise<void> {
  await apiClient.delete(path);
}
