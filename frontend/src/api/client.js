import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("propverse_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem("propverse_access_token");
      localStorage.removeItem("propverse_refresh_token");
      originalRequest._retry = true;
      window.location.href = '/signin?from=' + encodeURIComponent(window.location.pathname);
    }
    return Promise.reject(error);
  }
);

export default client;
