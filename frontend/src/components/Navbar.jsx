import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import useThemeStore from "../store/themeStore"; // Add this import

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { darkMode } = useThemeStore(); // Get darkMode state
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Add dark mode classes to the nav element
  return (
    <nav
      className={`bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 ${darkMode ? "dark" : ""}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col items-start gap-2 text-sm font-bold md:flex-row md:gap-24 md:text-align-baseline md:text-lg">
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            TODO APP
          </Link>

          <h2>Welcome {user?.username || "User"}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-6">
                  <img
                    src={user.avatar?.url || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {user.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
