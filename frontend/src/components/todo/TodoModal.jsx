import { useState } from "react";
import useTodoStore from "../../store/todoStore";
import todoService from "../../api/todo";
import useAuthStore from "../../store/authStore";

const TodoModal = () => {
  const { selectedTodo, setIsModalOpen, updateTodo, deleteTodo } =
    useTodoStore();
  const { accessToken } = useAuthStore();
  const [content, setContent] = useState(selectedTodo?.content || "");
  const [color, setColor] = useState(selectedTodo?.color || "blue");
  const [completed, setCompleted] = useState(selectedTodo?.completed || false);
  const [isLoading, setIsLoading] = useState(false);

  const colorOptions = [
    { value: "red", label: "Red", bg: "bg-red-100" },
    { value: "blue", label: "Blue", bg: "bg-blue-100" },
    { value: "green", label: "Green", bg: "bg-green-100" },
    { value: "yellow", label: "Yellow", bg: "bg-yellow-100" },
    { value: "purple", label: "Purple", bg: "bg-purple-100" },
    { value: "pink", label: "Pink", bg: "bg-pink-100" },
    { value: "orange", label: "Orange", bg: "bg-orange-100" },
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`w-8 h-8 rounded-full ${option.bg} border-2 ${
                  color === option.value
                    ? "border-gray-800"
                    : "border-transparent"
                }`}
                onClick={() => setColor(option.value)}
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
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="completed"
            className="ml-2 block text-sm text-gray-700"
          >
            Mark as completed
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
