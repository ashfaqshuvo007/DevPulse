import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);

router.post("/refresh-token", authController.refreshToken);

export const authRouter = router;
