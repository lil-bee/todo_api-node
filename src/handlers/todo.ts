import { Request, Response } from "express";
import { pool } from "../db";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY todo_id ASC "
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error("Error getting todos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOneTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM todos WHERE todo_id=${id}`);

    res.json({ data: result.rows });
  } catch (err) {
    console.error("Error getting todo:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, user_id } = req.body;
    const result = await pool.query(
      `INSERT INTO todos (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, user_id]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Error create todo:", err);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(201).json({ data: result.rows[0] });
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

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
