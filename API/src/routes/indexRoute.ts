import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { profileRoutes } from "./profileRoutes";

const router = Router();

router.use("/auth",authRoutes);
router.use("/profile",profileRoutes);

export default router;
