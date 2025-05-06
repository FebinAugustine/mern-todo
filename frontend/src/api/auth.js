import axiosInstance from "./axiosInstance";
import useAuthStore from "../store/authStore"; // Add import

const API_URL = import.meta.env.VITE_API_URL;

// auth.js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints
    if (originalRequest.url.includes("/auth/")) {
      return Promise.reject(error);
    }

    // Only handle 401 errors with valid refresh token
    const hasRefreshToken = document.cookie.includes("refreshToken=");
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken, refreshToken, user } =
          await authService.refreshToken();

        // Update store
        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setRefreshToken(refreshToken);
        useAuthStore.getState().setUser(user);

        // Update axios defaults
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 6. Handle refresh failure
        processQueue(refreshError);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  login: async (credentials) => {
    try {
      console.log("Sending login request with:", credentials);
      const response = await axiosInstance.post("/auth/login", credentials);
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log("Sending registration request...");
      const response = await axiosInstance.post("/auth/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data, // Important for FormData
      });

      return response;
    } catch (error) {
      console.error("Registration failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.get("/auth/refresh-token");
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      };
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      return response.data.data; // Extract nested data
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch profile";
    }
  },
  updateUserDetails: async (details) => {
    try {
      const response = await axiosInstance.put(
        "/users/update-details",
        details
      );
      return response.data.data; // Return direct user data
    } catch (error) {
      throw error.response?.data?.message || "Update failed";
    }
  },

  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const response = await axiosInstance.put(
        "/users/update-avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data; // Return direct user data
    } catch (error) {
      throw error.response?.data?.message || "Avatar update failed";
    }
  },

  updatePassword: async (passwords) => {
    try {
      const response = await axiosInstance.put(
        "/users/update-password",
        passwords
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Password update failed";
      throw new Error(errorMessage); // Explicitly create new Error
    }
  },
};

export default authService;
