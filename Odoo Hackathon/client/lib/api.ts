export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_BASE = "/api"; // primary base for dev/proxy
const FALLBACK_API_BASE = "/.netlify/functions/api"; // Netlify serverless function path (used in deploy)

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("ecofinds_token") || "" : "";
}

function buildUrl(path: string, query?: Record<string, any>, base: string = API_BASE) {
  // Build a relative URL using the provided base (defaults to API_BASE)
  let url = `${base}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      params.set(k, String(v));
    });
    const s = params.toString();
    if (s) url += `?${s}`;
  }
  return url;
}

async function request<T>(path: string, method: HttpMethod = "GET", body?: any): Promise<T> {
  const headers: Record<string, string> = {};
  if (method !== "GET") headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const bases = [API_BASE, FALLBACK_API_BASE];
  let lastErr: any = null;

  for (const base of bases) {
    const url = method === "GET" ? buildUrl(path, body, base) : buildUrl(path, undefined, base);
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === "GET" ? undefined : body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText || `HTTP ${res.status}`);
      }

      return (await res.json()) as T;
    } catch (err: any) {
      // capture and try next base
      lastErr = err;
      // If it's a non-network HTTP error (we got a response), don't retry other bases
      if (err && typeof err.message === "string" && !err.message.toLowerCase().includes("network")) {
        throw err;
      }
      // otherwise continue to next base
    }
  }

  throw new Error(`Network error while requesting ${path}: ${lastErr?.message || lastErr}`);
}

export const api = {
  register: (data: { name: string; email: string; password: string }) => request<{ token: string; user: any }>("/auth/register", "POST", data),
  login: (data: { email: string; password: string }) => request<{ token: string; user: any }>("/auth/login", "POST", data),
  me: () => request("/auth/me", "GET"),
  updateMe: (data: { name?: string; email?: string }) => request("/users/me", "PUT", data),

  listListings: (query?: { search?: string; category?: string }) => request<{ listings: any[]; categories: string[] }>("/listings", "GET", query),
  getListing: (id: string) => request(`/listings/${id}`, "GET"),
  createListing: (data: any) => request("/listings", "POST", data),
  updateListing: (id: string, data: any) => request(`/listings/${id}`, "PUT", data),
  deleteListing: (id: string) => request(`/listings/${id}`, "DELETE"),
  myListings: () => request("/me/listings", "GET"),

  cart: () => request<{ items: { listingId: string; addedAt: number }[] }>("/cart", "GET"),
  addToCart: (listingId: string) => request("/cart/add", "POST", { listingId }),
  removeFromCart: (listingId: string) => request("/cart/remove", "POST", { listingId }),
  checkout: () => request<{ purchases: any[] }>("/checkout", "POST"),
  purchases: () => request<any[]>("/purchases", "GET"),
  // admin
  adminData: () => request("/admin/data", "GET"),
};

export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("ecofinds_token", token);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("ecofinds_token");
}
