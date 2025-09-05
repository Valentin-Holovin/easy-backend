import { initDB } from "../database/db";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  photo?: string | null;
}

export class UserModel {
  static async create(user: User) {
    const db = await initDB();
    await db.run(
      "INSERT INTO users (name, email, password, photo) VALUES (?, ?, ?, ?)",
      [user.name, user.email, user.password, user.photo || null]
    );
  }

  static async findByEmail(email: string) {
    const db = await initDB();
    return db.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  static async findById(id: number) {
    const db = await initDB();
    return db.get("SELECT id, name, email, photo FROM users WHERE id = ?", [
      id,
    ]);
  }

  static async updatePhoto(id: number, photo: string): Promise<void> {
    const db = await initDB();
    await db.run("UPDATE users SET photo = ? WHERE id = ?", [photo, id]);
  }
}
