import { create } from "zustand";

const useTodoStore = create((set) => ({
  activeTodos: [],
  completedTodos: [],
  selectedTodo: null,
  isModalOpen: false,

  setTodos: (todos) =>
    set({
      activeTodos: todos.activeTodos || [],
      completedTodos: todos.completedTodos || [],
    }),
  addTodo: (todo) =>
    set((state) => ({
      activeTodos: [todo, ...state.activeTodos],
    })),
  updateTodo: (updatedTodo) =>
    set((state) => ({
      activeTodos: updatedTodo.completed
        ? state.activeTodos.filter((todo) => todo._id !== updatedTodo._id)
        : state.activeTodos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          ),
      completedTodos: updatedTodo.completed
        ? [updatedTodo, ...state.completedTodos]
        : state.completedTodos.filter((todo) => todo._id !== updatedTodo._id),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      activeTodos: state.activeTodos.filter((todo) => todo._id !== id),
      completedTodos: state.completedTodos.filter((todo) => todo._id !== id),
    })),
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));

export default useTodoStore;
