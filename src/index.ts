import express from "express";
import userRoutes from "./routes/userRoutes";
import path from "path";
import dotenv from "dotenv";

export const DEV_URL = `http://localhost:${process.env.PORT || 5001}`;

dotenv.config();

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", userRoutes);

app.listen(process.env.PORT || 5001, () => {
  console.log(`🚀 Server running at ${DEV_URL}`);
});
