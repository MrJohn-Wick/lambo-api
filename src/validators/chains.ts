import { Request, Response } from "express";
import { Result, ValidationError, validationResult} from 'express-validator';

export function errorResult(req: Request, res: Response) {
  const result: Result<ValidationError> = validationResult(req);
  if(result.array().length) {
    res.status(400).json({ status: "error", errors: result.array() });  
  }
}
