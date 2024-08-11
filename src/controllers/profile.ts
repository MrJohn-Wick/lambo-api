import { Request, Response } from 'express';
import { getUserById } from '../repositories/users';
import { User } from '@prisma/client';

export const profileController = {
  async me(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (currentUser) {
      const user = await getUserById(currentUser.id);
      return res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          profile: user.profile
        }
      });
    }

    res.sendStatus(404).json({
      success: false,
      error: {
        message: "User not found"
      }
    });
  }
}
