import { Request, Response } from 'express'
import { getCategories } from '../repositories/categories';
import { User } from '@prisma/client';
import { apiSuccessResponse } from '../utils/responses';

export const categoriesController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const categories = await getCategories({
      limit: Number(limit),
    });

    res.json(apiSuccessResponse(categories));
  },

  async userCategories(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const categories = await getCategories({
      userId: user.id,
    });

    res.json(apiSuccessResponse(categories));
  }
}
