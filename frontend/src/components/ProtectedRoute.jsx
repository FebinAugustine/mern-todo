import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = () => {
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated) {
          await initializeAuth();
        }
      } finally {
        setInitialized(true);
      }
    };

    checkAuth();
  }, [isAuthenticated, initializeAuth]);

  if (!initialized || isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
