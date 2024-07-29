import { Request, Response } from 'express';
import { createSubscribe } from '../repositories/subscription';
import { SubscriptionSchema } from '../schemas/subscription';
import { User } from '@prisma/client';

export const subscriptionController = {
  create(req: Request, res: Response) {
    
    const validatedValues = SubscriptionSchema.safeParse(req.body);

    if (!validatedValues.success) {
      return null;
    }
    
    const { authorId } = validatedValues.data;
    const user = req.user as User;

    // @TODO: need to check exist reference
    if (authorId) {
      createSubscribe(authorId, user.id);
    }

    return res.json({
      success: true,
    });
  }
}