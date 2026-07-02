import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "../utils/tokenStorage";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Fails loudly at startup instead of every request silently hitting "undefined/skills"
  throw new Error(
    "VITE_API_URL is not defined. Check frontend/.env and restart the dev server."
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Bearer token to every outgoing request, if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle expired/invalid tokens globally.
// If backend returns 401, clear the stale token and redirect to login,
// instead of every page having to catch this individually.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;