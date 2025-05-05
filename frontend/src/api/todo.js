import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getTodos = async (token) => {
  const response = await axios.get(`${API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const createTodo = async (todoData, token) => {
  const response = await axios.post(`${API_URL}/todos`, todoData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const updateTodo = async (id, todoData, token) => {
  const response = await axios.patch(`${API_URL}/todos/${id}`, todoData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const deleteTodo = async (id, token) => {
  const response = await axios.delete(`${API_URL}/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const getTodoById = async (id, token) => {
  const response = await axios.get(`${API_URL}/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const todoService = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
};

export default todoService;
