import { Schema } from "joi";

import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/BadRequestError";

/**
 * Middleware function for validating and sanitizing request query parameters using a Joi schema.
 * @param schema - The Joi schema used for validation.
 * @returns Express middleware function.
 * @throws BadRequestError if the query parameters do not match the specified schema.
 */
export function validateReqQuery(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.query = value;

    next();
  };
}

/**
 * Middleware function for validating and sanitizing request body using a Joi schema.
 * @param schema - The Joi schema used for validation.
 * @returns Express middleware function.
 * @throws BadRequestError if the request body does not match the specified schema.
 */
export function validateReqBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log(req.body);
    const { error, value } = schema.validate(req.body);

    if (error) {
      return next(new BadRequestError(error.message));
    }

    req.body = value;

    next();
  };
}
