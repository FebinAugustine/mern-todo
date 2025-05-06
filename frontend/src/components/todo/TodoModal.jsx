import { useState } from "react";
import useTodoStore from "../../store/todoStore";
import todoService from "../../api/todo";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore"; // Import theme store

const TodoModal = () => {
  const { selectedTodo, setIsModalOpen, updateTodo, deleteTodo } =
    useTodoStore();
  const { accessToken } = useAuthStore();
  const { darkMode } = useThemeStore(); // Get dark mode state
  const [content, setContent] = useState(selectedTodo?.content || "");
  const [color, setColor] = useState(selectedTodo?.color || "blue");
  const [completed, setCompleted] = useState(selectedTodo?.completed || false);
  const [isLoading, setIsLoading] = useState(false);

  // Updated color options with dark mode variants
  const colorOptions = [
    {
      value: "red",
      label: "Red",
      bg: "bg-red-100 dark:bg-red-900/30",
      border: "border-red-200 dark:border-red-800",
    },
    {
      value: "blue",
      label: "Blue",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      value: "green",
      label: "Green",
      bg: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-200 dark:border-green-800",
    },
    {
      value: "yellow",
      label: "Yellow",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    {
      value: "purple",
      label: "Purple",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      value: "pink",
      label: "Pink",
      bg: "bg-pink-100 dark:bg-pink-900/30",
      border: "border-pink-200 dark:border-pink-800",
    },
    {
      value: "orange",
      label: "Orange",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      border: "border-orange-200 dark:border-orange-800",
    },
  ];

  const handleUpdate = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const updatedTodo = await todoService.updateTodo(
        selectedTodo._id,
        { content, color, completed },
        accessToken
      );
      updateTodo(updatedTodo.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await todoService.deleteTodo(selectedTodo._id, accessToken);
      deleteTodo(selectedTodo._id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl transition-colors duration-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Edit Todo
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-8 h-8 rounded-full ${option.bg} border-2 transition-colors duration-200 ${
                  color === option.value
                    ? "border-gray-800 dark:border-gray-300"
                    : "border-transparent"
                }`}
                onClick={() => setColor(option.value)}
                aria-label={`Select ${option.label} color`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            id="completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-indigo-500"
          />
          <label
            htmlFor="completed"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Mark as completed
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md text-sm font-medium hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
