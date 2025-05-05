import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import authService from "../api/auth";

const useAuthCheck = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const { setUser, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.refreshToken();
        setUser(response.user);
        setAccessToken(response.accessToken);
      } catch (error) {
        logout();
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [setUser, setAccessToken, logout]);

  return authChecked;
};

export default useAuthCheck;
