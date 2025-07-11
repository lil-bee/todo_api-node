import { Request, Response } from "express";
import { pool } from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { errorResponse } from "../utils/response";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hash = await hashPassword(password);

    const user = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hash]
    );

    const token = createJWT(user.rows[0]);
    res.status(201).json({ token });
  } catch (e) {
    console.error("Error create user", e);
    return errorResponse(res, "Failed create user", 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      req.body.username,
    ]);

    if (user.rowCount === 0) {
      return errorResponse(res, "User not found", 404);
    }

    const isValid = await comparePasswords(
      req.body.password,
      user.rows[0].password
    );

    if (!isValid) {
      return errorResponse(res, "Invalid username or password", 401);
    }
    const token = createJWT(user.rows[0]);
    res.json({ token });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error", 500);
  }
};
