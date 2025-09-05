import { Router } from "express";
import { UserController } from "../controller/UserController";
import { upload } from "../middlewares/upload";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/register", upload.single("photo"), UserController.register);
router.post("/signin", UserController.signIn);
router.post("/logout", UserController.logout);
router.get("/profile", authMiddleware, UserController.getProfile);

export default router;
