import { Request, Response } from 'express';
import { createSubscribe, getSubscribtionsByUser, getSubscriptionByUserAndAuthor } from '../repositories/subscription';
import { User } from '@prisma/client';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getUserById } from '../repositories/users';

export const subscriptionController = {

  async subscribeToUser(req: Request, res: Response) {
    const currentUser = req.user;
    const authorId = req.params.id;

    if (!currentUser) throw("Does'n have user after auth middleware!!!");

    if (currentUser.id == authorId) {
      return res.status(409).json(apiErrorResponse(`Can't subscribe to themself`));
    }

    const authorUser = await getUserById(authorId);
    if (!authorUser) {
      return res.status(404).json(apiErrorResponse('User not found'));
    }
    
    const subscription = await getSubscriptionByUserAndAuthor(currentUser.id, authorUser.id);
    if (subscription) {
      return res.status(423).json(apiErrorResponse('Subscription already exist.'));
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
    
    const subscriptions = await getSubscribtionsByUser(user?.id);

    return res.json(apiSuccessResponse(subscriptions));
  }
}