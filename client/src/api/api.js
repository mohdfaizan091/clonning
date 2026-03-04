import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Response interceptor — 401 aane pe auto refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 aaya aur refresh already try nahi kiya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest); // original request dobara bhejo
      } catch {
        // Refresh bhi fail — user ko logout karo
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;