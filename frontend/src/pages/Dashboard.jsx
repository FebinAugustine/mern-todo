import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TodoForm from "../components/todo/TodoForm";
import TodoSection from "../components/todo/TodoSection";
import TodoModal from "../components/todo/TodoModal";
import useTodoStore from "../store/todoStore";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore"; // Import theme store
import todoService from "../api/todo";

const Dashboard = () => {
  const { activeTodos, completedTodos, isModalOpen } = useTodoStore();
  const { accessToken } = useAuthStore();
  const { darkMode } = useThemeStore(); // Get dark mode state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await todoService.getTodos(accessToken);
        useTodoStore.getState().setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? "border-indigo-400" : "border-indigo-500"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <TodoForm />

          <div className="mt-8 space-y-8">
            <TodoSection title="Active Todos" todos={activeTodos} />
            {completedTodos.length > 0 && (
              <TodoSection title="Completed Todos" todos={completedTodos} />
            )}
          </div>
        </div>
      </main>

      {isModalOpen && <TodoModal />}
    </div>
  );
};

export default Dashboard;
