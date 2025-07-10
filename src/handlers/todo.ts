import { Request, Response } from "express";
import { pool } from "../db";
import { errorResponse, successResponse } from "../utils/response";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY todo_id ASC "
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
    const { title, description, user_id } = req.body;
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
    const result = await pool.query("DELETE FROM todos WHERE todo_id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not Found" });
    }

    return successResponse(res, "todo deleted succssfully", result.rows[0]);
  } catch (err) {
    console.error("Error deleting todos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
