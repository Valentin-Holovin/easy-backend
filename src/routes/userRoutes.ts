import { Router } from "express";
import { UserController } from "../controller/UserController";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/register", upload.single("photo"), UserController.register);
router.post("/signin", UserController.signIn);

export default router;
