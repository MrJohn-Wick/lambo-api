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
        success: false,
        error: {
          message: "Subscription already exist."
        }
      });
    }

    const subscrbe = await createSubscribe(authorId, user.id);

    return res.json({
      success: true,
      payload: {
        subscrbe
      }
    });
  },

  async get(req: Request, res: Response) {    
    const userId = req?.body?.userId;
    
    const subscriptions = await getSubscribtionsByUser(userId);

    return res.json({
      success: true,
      payload: {
        subscriptions
      }
    });
  },

  async getForCurrentUser(req: Request, res: Response) {
    const user = req.user as User;
    
    const subscriptions = await getSubscribtionsByUser(user?.id);

    return res.json({
      success: true,
      data: {
        subscriptions
      }
    });
  }
}