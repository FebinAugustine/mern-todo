import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useState, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import useThemeStore from "../store/themeStore";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { darkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
          <h2 className="hidden sm:block">
            Welcome {user?.username || "User"}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center space-x-4" ref={dropdownRef}>
              <div className="flex items-center space-x-2 relative">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    src={user.avatar?.url || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    } ${darkMode ? "text-white" : "text-gray-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 top-10 mt-2 w-52 rounded-md shadow-lg ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-900"
                    } ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                  >
                    <div className="py-1">
                      <div className="px-4 py-4 border-b">
                        <p className="text-sm md:text-lg font-medium">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 pt-4 text-sm hover:${darkMode ? "bg-gray-600" : "bg-gray-100"}`}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm hover:${darkMode ? "bg-gray-600" : "bg-gray-100"}`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
