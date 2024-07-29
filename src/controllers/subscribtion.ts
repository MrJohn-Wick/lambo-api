import { Request, Response } from 'express';
import { createSubscribe, getSubscribtionsByUser, getSubscriptionByUserAndAuthor } from '../repositories/subscription';
import { SubscriptionSchema } from '../schemas/subscription';
import { User } from '@prisma/client';

export const subscriptionController = {
  async create(req: Request, res: Response) {
    
    const validatedValues = SubscriptionSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return null;
    }
    
    const { authorId } = validatedValues.data;
    const user = req.user as User;

    const sub = await getSubscriptionByUserAndAuthor(user?.id, authorId);

    if (sub) {
      return res.json({
        error: true,
        message: "Subscription already exist."
      });
    }

    createSubscribe(authorId, user.id);

    return res.json({
      success: true,
      message: "Subscription was added."
    });
  },

  async get(req: Request, res: Response) {    
    const userId = req?.body?.userId;
    
    const subscriptions = await getSubscribtionsByUser(userId);

    return res.json({
      success: true,
      data: subscriptions,
      message: !subscriptions ? "Subscriptions not found" : "Subscription was founded."
    });
  }
}