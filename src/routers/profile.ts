import { PrismaClient } from '@prisma/client';
import { Router, Request, Response, NextFunction } from 'express';
import passport from "passport";
import { UserRepository } from '../repositories/user_repository.js';
import { User } from '../entities/user.js';

export const profileRouter = Router();

profileRouter.get(
  '/me',
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.isAuthenticated()) next();

    const prisma = new PrismaClient();
    const userRepository = new UserRepository(prisma);
    const tokenUser: User | undefined = req.user as User;
    if (tokenUser) {
      const user = await userRepository.getUserWithProfile(tokenUser.id);
      res.json(user);
    }
    res.status(404).send();
  }
);
