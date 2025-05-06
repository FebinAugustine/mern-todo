import { useState } from "react";
import useTodoStore from "../../store/todoStore";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore"; // Import theme store
import todoService from "../../api/todo";

const TodoForm = () => {
  const [content, setContent] = useState("");
  const [color, setColor] = useState("blue");
  const { addTodo } = useTodoStore();
  const { accessToken } = useAuthStore();
  const { darkMode } = useThemeStore(); // Get dark mode state

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await todoService.createTodo(
        { content, color },
        accessToken
      );
      addTodo(response.data);
      setContent("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="flex space-x-2">
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

      <button
        type="submit"
        disabled={!content.trim()}
        className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition-colors duration-200"
      >
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
