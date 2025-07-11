import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTodo,
  deleteTodo,
  getOneTodo,
  getTodos,
  updateTodo,
} from "./handlers/todo";
import { createNewUser, login } from "./handlers/user";
import { validate } from "./modules/middleware";

const router = Router();

/* ===== TODO ====  */

router.get("/todos", getTodos);

router.get("/todos/:id", getOneTodo);

router.post(
  "/todos",
  validate([
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("user_id").notEmpty().isInt().withMessage("User ID must be number"),
  ]),
  createTodo
);

router.put(
  "/todos/:id",
  param("id").isInt().withMessage("Todo ID must be a number"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  updateTodo
);

router.delete("/todos/:id", deleteTodo);

/* ===== USER ====  */

router.get("/users", (req, res) => {
  res.json({ message: "users" });
});

router.get("/users/:id", (req, res) => {});

router.put("/users/:id", (req, res) => {});

router.delete("/users/:id", (req, res) => {});

/* ===== AUTH ====  */

router.post("/register", createNewUser);

router.post("/login", login);

export default router;
