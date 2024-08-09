import { Request, Response } from 'express'
import { getCategories } from '../repositories/categories';
import { User } from '@prisma/client';

export const categoriesController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const categories = await getCategories({
      limit: Number(limit),
    });

    res.json({
      success: true,
      payload: categories
    });
  },

  async userCategories(req: Request, res: Response) {
    const user = req.user as User;
    
    if (!user) {
      return res.send('Unauthorized');
    }

    const categories = await getCategories({
      userId: user.id,
    });

    res.json({
      success: true,
      payload: categories
    });
  }
}
