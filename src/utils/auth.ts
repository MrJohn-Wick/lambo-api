import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export function isAuthorized(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.sendStatus(401);
    return;
  }
  
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    console.log(err);
    if (err) 
      return res.sendStatus(403);
    next()
  });
}
