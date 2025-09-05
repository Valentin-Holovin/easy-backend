// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const SECRET_KEY = "super_secret_key";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: "Token has expired" });
      return;
    }
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
