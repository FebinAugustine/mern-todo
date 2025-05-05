import { useState } from "react";
import useTodoStore from "../../store/todoStore";
import useAuthStore from "../../store/authStore";
import todoService from "../../api/todo";

const TodoForm = () => {
  const [content, setContent] = useState("");
  const [color, setColor] = useState("blue");
  const { addTodo } = useTodoStore();
  const { accessToken } = useAuthStore();

  const colorOptions = [
    { value: "red", label: "Red", bg: "bg-red-100" },
    { value: "blue", label: "Blue", bg: "bg-blue-100" },
    { value: "green", label: "Green", bg: "bg-green-100" },
    { value: "yellow", label: "Yellow", bg: "bg-yellow-100" },
    { value: "purple", label: "Purple", bg: "bg-purple-100" },
    { value: "pink", label: "Pink", bg: "bg-pink-100" },
    { value: "orange", label: "Orange", bg: "bg-orange-100" },
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex space-x-2">
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

      <button
        type="submit"
        disabled={!content.trim()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
