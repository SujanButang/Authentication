import HttpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import UnauthenticatedError from "../errors/UnauthenticatedError";

import NotFoundError from "../errors/NotfoundError";
import NotAcceptableError from "../errors/NotAcceptableError";

/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 */
export function notFoundError(_req: Request, res: Response) {
  return res.status(HttpStatus.NOT_FOUND).json({
    message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND),
  });
}

/**
 * Generic error handler function for handling various types of errors
 * Logs the error stack trace, categorizes known custom errors, and sends appropriate HTTP responses.
 * @param err - The error object to handle.
 * @param _req - The Express request object
 * @param res - The Express response object to send the error response.
 * @param _next - The Express next function
 */
export function genericErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line
) {
  if (err.stack) {
    console.error(err.stack);
  }

  if (err instanceof UnauthenticatedError) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
  }
  if (err instanceof NotAcceptableError) {
    return res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: err.message });
  }
  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
}
