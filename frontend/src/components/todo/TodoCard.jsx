import { format } from "date-fns";
import useTodoStore from "../../store/todoStore";
import useThemeStore from "../../store/themeStore"; // Import theme store

const TodoCard = ({ todo }) => {
  const { setSelectedTodo, setIsModalOpen } = useTodoStore();
  const { darkMode } = useThemeStore(); // Get dark mode state

  // Updated color classes with dark mode variants
  const colorClasses = {
    red: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    green:
      "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
    pink: "bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
  };

  const handleClick = () => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        colorClasses[todo.color]
      } cursor-pointer transition-all hover:shadow-md dark:hover:shadow-gray-700/50`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`font-medium ${
            todo.completed
              ? "line-through text-gray-500 dark:text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {todo.content}
        </h3>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-500"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {format(new Date(todo.createdAt), "MMM dd, yyyy h:mm a")}
      </p>
    </div>
  );
};

export default TodoCard;
