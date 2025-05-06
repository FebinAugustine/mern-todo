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

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),

      initializeAuth: async () => {
        const currentState = get();
        if (currentState.isAuthenticated) return true;

        set({ isLoading: true });
        try {
          const { accessToken, refreshToken, user } =
            await authService.refreshToken();

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
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
          // Update user state with complete data
          set({
            user: response.data.user, // Changed from response.user
            accessToken: response.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
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
        console.log("[AuthStore] Logging out...");
        set({ isLoading: true });
        try {
          await authService.logout();
          console.log("[AuthStore] Backend logout successful");

          // Clear all cookies
          document.cookie =
            "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie =
            "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        } catch (error) {
          console.error("[AuthStore] Logout error:", error);
        } finally {
          console.log("[AuthStore] Clearing local state");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Profile actions
      fetchProfile: async () => {
        try {
          const profileData = await authService.getProfile();
          set({ user: profileData.user });
          return profileData;
        } catch (error) {
          console.error("Profile fetch failed:", error);
          throw error;
        }
      },

      // Update all user state management functions
      updateUserDetails: async (details) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateUserDetails(details);
          set((state) => ({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
          }));
          return updatedUser;
        } catch (error) {
          set({ error, isLoading: false });
          throw error;
        }
      },
      updateAvatar: async (avatarFile) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateAvatar(avatarFile);
          set((state) => ({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
          }));
          return updatedUser;
        } catch (error) {
          set({ error, isLoading: false });
          throw error;
        }
      },
      updatePassword: async (passwords) => {
        set({ isLoading: true });
        try {
          const response = await authService.updatePassword(passwords);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({
            error: error.message, // Store the actual error message
            isLoading: false,
          });
          throw error; // Re-throw to propagate to component
        }
      },

      // Token management
      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();
          set({
            accessToken: response.accessToken,
            user: response.user,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          set({ isAuthenticated: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated, // Add this
      }),
      version: 1, // Add version
      migrate: (persistedState, version) => {
        if (version === 0) return persistedState;
        return persistedState;
      },
    }
  )
);

export default useAuthStore;
