import { format } from "date-fns";
import useTodoStore from "../../store/todoStore";

const TodoCard = ({ todo }) => {
  const { setSelectedTodo, setIsModalOpen } = useTodoStore();

  const colorClasses = {
    red: "bg-red-100 border-red-200",
    blue: "bg-blue-100 border-blue-200",
    green: "bg-green-100 border-green-200",
    yellow: "bg-yellow-100 border-yellow-200",
    purple: "bg-purple-100 border-purple-200",
    pink: "bg-pink-100 border-pink-200",
    orange: "bg-orange-100 border-orange-200",
  };

  const handleClick = () => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        colorClasses[todo.color]
      } cursor-pointer transition-all hover:shadow-md`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`font-medium ${
            todo.completed ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {todo.content}
        </h3>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {format(new Date(todo.createdAt), "MMM dd, yyyy h:mm a")}
      </p>
    </div>
  );
};

export default TodoCard;
