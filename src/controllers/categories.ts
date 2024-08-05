import { Request, Response } from 'express'
import { getCategories } from '../repositories/categories';

export const categoriesController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const streams = await getCategories(limit);

    res.json(streams);
  },
}
