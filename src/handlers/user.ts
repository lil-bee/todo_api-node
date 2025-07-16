import { Request, Response } from "express";
import { pool } from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";
import { errorResponse } from "../utils/response";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // input validagtion
    if (!username || !email || !password) {
      return errorResponse(
        res,
        "Username, email, and password are required",
        400
      );
    }
    if (password.length < 6) {
      return errorResponse(res, "Password must be at least 6 characters", 400);
    }

    const hash = await hashPassword(password);

    const user = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hash]
    );

    const token = createJWT(user.rows[0]);
    res.status(201).json({ token, user: user.rows[0] });
  } catch (e) {
    console.error("Error create user", e);
    return errorResponse(res, "Failed create user", 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // input validation
    if (!username || !password) {
      return errorResponse(res, "Username and password are required", 400);
    }

    // get user data
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    // check username
    if (user.rowCount === 0) {
      return errorResponse(res, "Invalid username or password", 401);
    }

    // check password
    const isValid = await comparePasswords(password, user.rows[0].password);
    if (!isValid) {
      return errorResponse(res, "Invalid username or password", 401);
    }

    // Return token && user without password
    const token = createJWT({
      id: user.rows[0].user_id,
      username: user.rows[0].username,
    });

    const { password: _, ...userWithoutPassword } = user.rows[0];

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error", 500);
  }
};
