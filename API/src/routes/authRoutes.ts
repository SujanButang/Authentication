import { Router } from "express";
import {
  handleEmailVerification,
  handleOtpVerification,
  handlePasswordChange,
  handlePasswordReset,
  handleRequestPasswordReset,
  handleResetOTPVerification,
  handleUserLogin,
  handleUserRegister,
} from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";
import { validateReqBody } from "../middlewares/validator";
import { changePasswordSchema, emailSchema, loginSchema, otpSchema, resgiterSchema } from "../validationSchema/authSchema";

const router = Router();

router.post("/register",validateReqBody(resgiterSchema), handleUserRegister);
router.post("/login",validateReqBody(loginSchema), handleUserLogin);
router.get("/verifyEmail", verifyAuth, handleEmailVerification);
router.post("/verifyOtp",validateReqBody(otpSchema), verifyAuth, handleOtpVerification);
router.post("/reqReset",validateReqBody(emailSchema), handleRequestPasswordReset);
router.post("/verifyResetOtp",validateReqBody(otpSchema), handleResetOTPVerification);
router.post("/resetPassword",validateReqBody(loginSchema), handlePasswordReset);
router.post("/changePassword",validateReqBody(changePasswordSchema), verifyAuth, handlePasswordChange);

export { router as authRoutes };
