import { Router } from "express";
import { createTodo, getOneTodo, getTodos } from "./handlers/todo";

const router = Router();

/* ===== TODO ====  */

router.get("/todos", getTodos);

router.get("/todos/:id", getOneTodo);

router.post("/todos", createTodo);

router.put("/todos/:id", (req, res) => {});

router.delete("/todos/:id", (req, res) => {});

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
