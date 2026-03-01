/**
 * Shared API client with base URL from env and JWT token injection.
 */

const getBaseUrl = () => import.meta.env.VITE_API_URL_BACKEND_PRODUCTION || "http://localhost:3001";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export interface ApiError {
  message?: string;
  error?: string;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const headers = { ...getAuthHeaders(), ...options.headers };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errMsg =
      (data as ApiError).message || (data as ApiError).error || response.statusText;
    throw new Error(errMsg);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string) =>
    apiFetch<T>(path, { method: "GET" }),

  post: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }),
};
