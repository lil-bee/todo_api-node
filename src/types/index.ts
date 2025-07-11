export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  id: string;
  username: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
