import { Request, Response } from 'express';
import { createSubscribe, getSubscribtionsByUser, getSubscriptionByUserAndAuthor } from '../repositories/subscription';
import { User } from '@prisma/client';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getUserById } from '../repositories/users';
import { ErrorMessages } from '../constants';

export const subscriptionController = {

  async subscribeToUser(req: Request, res: Response) {
    const currentUser = req.user;
    const authorId = req.params.id;

    if (!currentUser) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    if (currentUser.id == authorId) {
      return res.status(409).json(apiErrorResponse(ErrorMessages.subscribeThemself));
    }

    const authorUser = await getUserById(authorId);
    if (!authorUser) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.userNotFound));
    }
    
    const subscription = await getSubscriptionByUserAndAuthor(currentUser.id, authorUser.id);
    if (subscription) {
      return res.status(423).json(apiErrorResponse(ErrorMessages.subscriptionsExist));
    }

    const subscribe = await createSubscribe(authorUser.id, currentUser.id);

    return res.json(apiSuccessResponse(subscribe));
  },

  async get(req: Request, res: Response) {    
    const userId = req?.body?.userId;
    
    const subscriptions = await getSubscribtionsByUser(userId);

    return res.json(apiSuccessResponse(subscriptions));
  },

  async getForCurrentUser(req: Request, res: Response) {
    const user = req.user as User;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }
    
    const subscriptions = await getSubscribtionsByUser(user.id);

    return res.json(apiSuccessResponse(subscriptions));
  }
}