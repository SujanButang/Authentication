import { NextFunction, Request, Response } from "express";
import {
  changePassword,
  createUser,
  requestPasswordReset,
  resetPassword,
  signInUser,
  verifyEmail,
  verifyOtp,
  verifyResetOtp,
} from "../services/authService";

/**
 * Handles user registration by creating a new user with provided details.
 * @param req - The Express Request object containing user registration details.
 * @param res - The Express Response object to send the registration response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username, profileImage } = req.body;
    const response = await createUser(email, username, password, profileImage);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the email verification process for a user after registration.
 * @param req - The Express Request object.
 * @param res - The Express Response object to send the email verification response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.userId;
    const response = await verifyEmail(userId);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the OTP (One-Time Password) verification process for a user.
 * @param req - The Express Request object containing OTP and user details.
 * @param res - The Express Response object to send the OTP verification response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleOtpVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.userId;
    const { otp } = req.body;
    const response = await verifyOtp(userId, otp);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login by authenticating the provided credentials and generating tokens.
 * @param req - The Express Request object containing user login details.
 * @param res - The Express Response object to send the login response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const response = await signInUser(email, password);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the request for a password reset by initiating the OTP generation and email process.
 * @param req - The Express Request object containing the user's email.
 * @param res - The Express Response object to send the password reset request response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleRequestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const response = await requestPasswordReset(email);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the OTP verification process for resetting the user's password.
 * @param req - The Express Request object containing the user's email and OTP.
 * @param res - The Express Response object to send the OTP verification response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleResetOTPVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    const response = await verifyResetOtp(email, otp);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the password reset process after OTP verification.
 * @param req - The Express Request object containing the user's email and new password.
 * @param res - The Express Response object to send the password reset response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handlePasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const response = await resetPassword(email, password);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the process of changing a user's password after authentication.
 * @param req - The Express Request object containing the user's ID, current password, and new password.
 * @param res - The Express Response object to send the password change response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handlePasswordChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.userId;
    const { password, newPassword } = req.body;
    const response = await changePassword(userId, password, newPassword);
    res.status(response.status).json(response.message);
  } catch (error) {
    next(error);
  }
};
