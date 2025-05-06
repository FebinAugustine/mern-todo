import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../api/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        // Skip if already authenticated
        if (get().isAuthenticated) return true;

        set({ isLoading: true, error: null });
        try {
          const { user, accessToken } = await authService.refreshToken();

          if (!user || !accessToken) {
            throw new Error("Invalid auth response");
          }

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.error("Auth initialization failed:", error);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          return false;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          if (!response.data?.data?.user) {
            // Notice the .data.data.user
            throw new Error("Registration response missing user data");
          }
          set({
            user: response.data.data.user,
            accessToken: response.data.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed. Please try again.";
          console.error("Registration error:", errorMessage, error);
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!(state.accessToken && state.user);
        }
      },
    }
  )
);

export default useAuthStore;
