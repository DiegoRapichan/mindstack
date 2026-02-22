import axios from "axios";

export const api = axios.create({
  baseURL: "https://mindstack-api-cdy3.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Mindstack:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
