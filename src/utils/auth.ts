import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { error } from 'console';
import { usersService } from '@lambo/services/users';
import { sessionsService } from '@lambo/services/sessions';

export function getToken(req: Request): string | undefined {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  return token;
}

export async function verifyToken(token: string): Promise<JwtPayload | undefined> {
  return new Promise((resolv, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, payload: any) => {
      if(err) {
        reject(error);
      }
      resolv(payload);
    });
  })
};

export async function isAuthorized(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = getToken(req);

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const payload = await verifyToken(token)
  if (!payload) {
    res.sendStatus(401);
    return;
  }

  const session = await sessionsService.verifyToken(token);
  if (!session) {
    res.sendStatus(401);
    return;
  }
  
  next();
}
