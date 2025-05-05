import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn("Auth check timeout");
        setIsLoading(false);
        setUserLoading(false);
      }
    }, 3000); // Reduced to 3 seconds

    const checkAuth = async () => {
      try {
        // Only initialize if we have stored auth but no current user
        if (localStorage.getItem("auth-storage") && !user) {
          await initializeAuth();
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setUserLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, initializeAuth]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-indigo-600">
          TodoApp
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar?.url || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {user.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Loading user...</div>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
