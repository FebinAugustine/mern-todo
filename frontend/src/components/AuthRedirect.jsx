import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LoadingScreen from "./LoadingScreen";

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;
