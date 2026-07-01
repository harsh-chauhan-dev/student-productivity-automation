import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token has expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh access token
        await api.post("/auth/refresh-token");

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("spa_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;