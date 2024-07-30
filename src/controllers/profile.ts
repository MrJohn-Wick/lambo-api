import { Request, Response } from 'express';
import { getUserById } from '../repositories/users';
import { User } from '@prisma/client';

export const profileController = {
  async me(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (currentUser) {
      const user = await getUserById(currentUser.id);
      return res.json(user);
    }

    res.sendStatus(404);
  },

  availableForCall(req: Request, res: Response) {
    res.json({
      user: req.user, // current user
    })
  }
}
