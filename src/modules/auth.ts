import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types";
import { errorResponse } from "../utils/response";

interface UserType {
  id: string;
  username: string;
}

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 12);
};

export const createJWT = (user: UserType) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "24h",
    }
  );
  return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return errorResponse(res, "Not Authorized", 401);
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    return errorResponse(res, "Not Authorized", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    next();
    return;
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Not Authorized", 401);
  }
};
