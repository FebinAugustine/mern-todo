import TodoCard from "./TodoCard";

const TodoSection = ({ title, todos }) => {
  if (!todos || todos.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <TodoCard key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default TodoSection;
