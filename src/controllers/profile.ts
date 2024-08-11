import { Request, Response } from 'express';
import { getUserById, updateUserPassword } from '../repositories/users';
import { User } from '@prisma/client';
import { getProfileByUserId, updateProfile } from '../repositories/profile';
import { ProfileUpdateSchema } from '../schemas/profile';
import { PasswordUpdateSchema } from '../schemas/signup';

export const profileController = {
  async me(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (currentUser) {
      const user = await getUserById(currentUser.id);
      const profile = await getProfileByUserId(user.id);
      return res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          profile: profile
        }
      });
    }

    res.sendStatus(404).json({
      success: false,
      error: {
        message: "User not found"
      }
    });
  },

  async update(req: Request, res: Response) {
    const user = req.user;
    const validatedValues = ProfileUpdateSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.json({
        success: false,
        error: {
          message: "Invalid request: " + validatedValues.error        
        }
      });
    }

    if (user && validatedValues.data) {
      try {
        await updateProfile(user.id, validatedValues.data);
        return res.json({
          success: true,
        })
      } catch (error) {
        return res.json({
          success: false,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
          }
        })
      }
    }

    res.json({
      success: false,
      error: {
        message: 'Invalid requiest'
      }
    });
  },

  async password(req: Request, res: Response) {
    const user = req.user;
    const validatedValues = PasswordUpdateSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.json({
        success: false,
        error: {
          message: "Invalid request: " + validatedValues.error        
        }
      });
    }

    if (user) {
      try {
        await updateUserPassword(user.id, validatedValues.data.password);
        return res.json({
          success: true,
        })
      } catch (error) {
        return res.json({
          success: false,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
          }
        })
      }
    }

    res.json({
      success: false,
      error: {
        message: 'Invalid requiest'
      }
    });
  },

}
