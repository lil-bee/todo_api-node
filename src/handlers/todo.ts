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
