import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const JWT_SECRET = "super_secret_key";
const JWT_EXPIRES = "1h";

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const photo = req.file ? req.file.filename : null;

      const errors: string[] = [];

      if (!name || !email || !password) {
        errors.push("All fields except photo are required");
      } else {
        if (name.length < 3) {
          errors.push("Name must be at least 3 characters long");
        }

        if (!validator.isEmail(email)) {
          errors.push("Invalid email format");
        }

        if (password.length < 8) {
          errors.push("Password must be at least 8 characters long");
        }

        if (!/\d/.test(password)) {
          errors.push("Password must contain at least one number");
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ errors: ["Email already registered"] });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.create({ name, email, password: hashedPassword, photo });

      res.json({ success: true, message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }

  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const errors: string[] = [];

      if (!email || !password) {
        errors.push("Email and password are required");
      } else {
        if (!validator.isEmail(email)) {
          errors.push("Invalid email format");
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ errors: ["Invalid email or password"] });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ errors: ["Invalid email or password"] });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });

      res.json({
        success: true,
        message: "User signed in successfully",
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
  static async logout(req: Request, res: Response) {
    try {
      res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
}
