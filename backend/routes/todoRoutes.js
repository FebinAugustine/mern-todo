import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from "../controllers/todoController.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getAllTodos);
router.route("/").post(createTodo);
router.route("/:id").get(getTodoById);
router.route("/:id").patch(updateTodo);
router.route("/:id").delete(deleteTodo);

export default router;
