import { Router } from "express";
import { handleGetUserDetails } from "../controllers/profileControler";
import { verifyAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/",verifyAuth, handleGetUserDetails);

export {router as profileRoutes};