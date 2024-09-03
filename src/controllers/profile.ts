import { Request, Response } from 'express';
import { getUserById, updateUserPassword } from '../repositories/users';
import { User } from '@prisma/client';
import { getProfileByUserId, updateProfile } from '../repositories/profile';
import { ProfileUpdateSchema } from '../schemas/profile';
import { PasswordUpdateSchema } from '../schemas/signup';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const profileController = {
  async me(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (!currentUser) throw("Does'n have user after auth middleware!!!");

    const user = await getUserById(currentUser.id);
    if (user) {
      const profile = await getProfileByUserId(user.id);
      return res.json(apiSuccessResponse({
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
        password: !!user.passwordHash,
        profile: profile
      }));
    }

    res.status(404).json(apiErrorResponse('User not found'));
  },

  async update(req: Request, res: Response) {
    const user = req.user;
    const validatedValues = ProfileUpdateSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.status(400).json(apiErrorResponse('Invalid request'));
    }

    if (user && validatedValues.data) {
      try {
        await updateProfile(user.id, validatedValues.data);
        return res.json(apiSuccessResponse());
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          return res.status(406).json(apiErrorResponse('This username is already exists'));
        }
        return res.status(422).json(apiErrorResponse(error instanceof Error ? error.message : 'Unknown error'));
      }
    }

    res.status(400).json(apiErrorResponse('Invalid requiest'));
  },

  async password(req: Request, res: Response) {
    const user = req.user;
    const validatedValues = PasswordUpdateSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.status(400).json(apiErrorResponse('Invalid requiest'));
    }

    if (user) {
      try {
        await updateUserPassword(user.id, validatedValues.data.password);
        return res.json(apiSuccessResponse({'message': 'Password changed'}));
      } catch (error) {
        return res.status(422).json(apiErrorResponse(error instanceof Error ? error.message : 'Unknown error'));
      }
    }

    res.status(400).json(apiErrorResponse('Invalid requiest'));
  },
}
