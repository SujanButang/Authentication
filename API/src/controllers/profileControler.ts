import { NextFunction, Request, Response } from "express";
import { getProfileDetails } from "../services/profileService";


/**
 * Handles the retrieval of user profile details based on the authenticated user's ID.
 * @param req - The Express Request object.
 * @param res - The Express Response object to send the user profile details response.
 * @param next - The Express NextFunction to handle errors and pass control to the next middleware.
 */
export const handleGetUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.userId;
    const response = await getProfileDetails(userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
