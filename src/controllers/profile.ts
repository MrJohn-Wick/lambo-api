import { Request, Response } from 'express';
import { updateUserPassword } from '../repositories/users';
import { User } from '@prisma/client';
import { updateProfile } from '../repositories/profile';
import { ProfileUpdateSchema } from '../schemas/profile';
import { PasswordUpdateSchema } from '../schemas/signup';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { moveObjectToAvatars } from '../utils/s3';
import { usersController } from './users';
import { ErrorMessages } from '../constants';
import { settingsController } from './settings';


export const profileController = {

  async me(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    req.params.id = currentUser.id;
    
    return usersController.get(req, res);
  },

  async update(req: Request, res: Response) {
    
    const user = req.user;
    
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const validatedValues = await ProfileUpdateSchema.safeParseAsync(req.body);
    
    if (!validatedValues.success) {
      
      const messages = validatedValues.error.errors.map((e) => e.path+":"+e.message);
      
      return res.status(400).json(apiErrorResponse(`${ErrorMessages.invalidRequest} ${messages.join('. ')}`));
    }

    if (user && validatedValues.data) {
      try {
        await updateProfile(user.id, validatedValues.data);
        return res.json(apiSuccessResponse());
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          return res.status(406).json(apiErrorResponse(ErrorMessages.usernameExist));
        }
        return res.status(422).json(apiErrorResponse(error instanceof Error ? error.message : ErrorMessages.unknown));
      }
    }

    res.status(400).json(apiErrorResponse(ErrorMessages.invalidRequest));
  },

  async password(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const validatedValues = PasswordUpdateSchema.safeParse(req.body);
    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.path+":"+e.message);
      return res.status(400).json(apiErrorResponse(`${ErrorMessages.invalidRequest} ${messages.join('. ')}`));
    }

    if (user) {
      try {
        await updateUserPassword(user.id, validatedValues.data.password);
        return res.json(apiSuccessResponse({'message': 'Password changed'}));
      } catch (error) {
        return res.status(422).json(apiErrorResponse(error instanceof Error ? error.message : 'Unknown error'));
      }
    }

    res.status(400).json(apiErrorResponse(ErrorMessages.invalidRequest));
  },

  async settings(req: Request, res: Response) {
    const currentUser = req.user as User;
    if (!currentUser) throw("Does'n have user after auth middleware!!!");

    req.params.id = currentUser.id;
    
    return settingsController.get(req, res);
  },

}
