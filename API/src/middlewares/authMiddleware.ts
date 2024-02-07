import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnauthenticatedError from "../errors/UnauthenticatedError";
import NotAcceptableError from "../errors/NotAcceptableError";

// Declare an interface to extend the Request interface

/**
 * Middleware function to verify the authenticity of the provided access token.
 * Checks for the presence of the access token in cookies and verifies its validity.
 * If the token is valid, sets user information in the local context for subsequent middleware.
 * @param req - The Express request object containing cookies with the access token.
 * @param res - The Express response object to send the result.
 * @param next - The Express next function to pass control to the next middleware.
 */
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1] as string;

    if (!accessToken) {
      throw new UnauthenticatedError("No access token");
    }

    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
      async (err: unknown, userInfo: JwtPayload | undefined | string) => {
        if (err) {
          throw new NotAcceptableError("Token is invalid");
        }

        if (!userInfo) {
          throw new NotAcceptableError("Invalid token payload");
        }

        res.locals.user = userInfo;

        return next();
      }
    );
  } catch (error) {
    next(error);
  }
};
