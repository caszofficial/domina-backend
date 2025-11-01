import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);

export default router;
