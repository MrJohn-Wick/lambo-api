import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export function resultValidation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result: Result<ValidationError> = validationResult(req);

  if (result.array().length) {
    res.status(400).json({ status: "error", errors: result.array() });
    return;
  }

  next();
}
