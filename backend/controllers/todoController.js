import { Todo } from "../database/models/Todo.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

const getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { activeTodos, completedTodos },
        "Todos fetched successfully"
      )
    );
});

const createTodo = asyncHandler(async (req, res) => {
  const { content, color } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const todo = await Todo.create({
    content,
    color,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, completed, color } = req.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { content, completed, color },
    { new: true }
  );

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo deleted successfully"));
});

const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, owner: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

export { getAllTodos, createTodo, updateTodo, deleteTodo, getTodoById };
