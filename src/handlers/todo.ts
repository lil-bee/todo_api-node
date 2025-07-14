import { Request, Response } from "express";
import { pool } from "../db";
import { JWTPayload } from "../types";
import { errorResponse, successResponse } from "../utils/response";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const user_id = (req.user as JWTPayload).id;
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY todo_id ASC",
      [user_id]
    );

    return successResponse(res, "Todos fetched succssfully", result.rows);
  } catch (err) {
    console.error("Error getting todos:", err);
    return errorResponse(res, "Failed to fetch todos", 500);
  }
};

export const getOneTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM todos WHERE todo_id=${id}`);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not Found" });
    }

    return successResponse(res, "Todos fetched succssfully", result.rows);
  } catch (err) {
    console.error("Error getting todo:", err);
    return errorResponse(res, "Failed to fetch todos", 500);
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const user_id = (req.user as JWTPayload).id;
    const result = await pool.query(
      `INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, user_id]
    );

    return successResponse(res, "todo created succssfully", result.rows[0]);
  } catch (err) {
    console.error("Error create todo:", err);
    return errorResponse(res, "Failed to create todos", 500);
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const user_id = (req.user as JWTPayload).id;
    const id = req.params.id;
    const result = await pool.query(
      `UPDATE todos SET title = $1, description = $2, updated_at = NOW() WHERE todo_id = $3 RETURNING *`,
      [title, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not Found" });
    }

    return successResponse(res, "todo updated succssfully", result.rows[0]);
  } catch (err) {
    console.error("Error update todo:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // 1. Cek apakah todo ada
    const existing = await pool.query(
      "SELECT * FROM todos WHERE todo_id = $1",
      [id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // 2. Cek apakah todo ini milik user yang login
    const todo = existing.rows[0];
    if (todo.user_id !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this todo" });
    }

    // 3. Hapus data
    const result = await pool.query(
      "DELETE FROM todos WHERE todo_id = $1 RETURNING *",
      [id]
    );

    return successResponse(
      res,
      "todo deleted successfully",
      result.rows[0],
      204
    );
  } catch (err) {
    console.error("Error deleting todos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
