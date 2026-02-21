import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Interceptor: Injeta o Token JWT automaticamente em todas as requisições!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Mindstack:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
