import { Request, Response } from 'express';
import { createSubscribe, getSubscribtionsByUser, getSubscriptionByUserAndAuthor } from '../repositories/subscription';
import { SubscriptionSchema } from '../schemas/subscription';
import { User } from '@prisma/client';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';

export const subscriptionController = {
  async create(req: Request, res: Response) {
    
    const validatedValues = SubscriptionSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.status(400).json(apiErrorResponse('Invalid requiest'));
    }
    
    const { authorId } = validatedValues.data;
    const user = req.user as User;

    const sub = await getSubscriptionByUserAndAuthor(user?.id, authorId);

    if (sub) {
      return res.status(423).json(apiErrorResponse('Subscription already exist.'));
    }

    const subscrbe = await createSubscribe(authorId, user.id);

    return res.json(apiSuccessResponse(subscrbe));
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