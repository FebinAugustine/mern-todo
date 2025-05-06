import axiosInstance from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

// Add request interceptor to inject token (modified)
axiosInstance.interceptors.request.use((config) => {
  // We'll handle the token injection differently
  return config;
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/auth/refresh-token");
        const { accessToken } = response.data;

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // We'll handle logout in the component
        return Promise.reject(refreshError);
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

      console.log("Registration successful:", response.data);
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
      const response = await axiosInstance.get("/auth/refresh-token", {
        withCredentials: true,
      });

      if (!response.data?.data?.user) {
        // Note the nested structure from ApiResponse
        throw new Error("No user data in refresh response");
      }

      // Return both user and accessToken
      return {
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
      };
    } catch (error) {
      console.error("Refresh token failed:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },
};

export default authService;
