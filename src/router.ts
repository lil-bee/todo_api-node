import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getOneTodo,
  getTodos,
  updateTodo,
} from "./handlers/todo";

const router = Router();

/* ===== TODO ====  */

router.get("/todos", getTodos);

router.get("/todos/:id", getOneTodo);

router.post("/todos", createTodo);

router.put("/todos/:id", updateTodo);

router.delete("/todos/:id", deleteTodo);

/* ===== USER ====  */

router.get("/users", (req, res) => {
  res.json({ message: "users" });
});

router.get("/users/:id", (req, res) => {});

router.put("/users/:id", (req, res) => {});

router.delete("/users/:id", (req, res) => {});

/* ===== AUTH ====  */

router.post("/register", (req, res) => {});

router.post("/login", (req, res) => {});

export default router;
