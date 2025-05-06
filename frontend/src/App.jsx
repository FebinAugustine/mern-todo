import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
    };
    checkAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main className="container mx-auto p-4">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
