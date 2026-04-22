import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL : "https://rogveda-backend.onrender.com/",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach vendor token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vendorToken");
  if (token) config.headers["x-vendor-token"] = token;
  return config;
});

// Normalize error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
