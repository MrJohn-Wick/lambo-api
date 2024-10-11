import { Request, Response } from 'express'
import { getCategories } from '../repositories/categories';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { ErrorMessages } from '../constants';
import { CategoryDTO } from '../dtos/category';

export const categoriesController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const categories = await getCategories({
      limit: Number(limit),
    });

    console.log("categories", categories);
    res.json(apiSuccessResponse(categories.map(c => new CategoryDTO(c))));
  },

  async userCategories(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const categories = await getCategories({
      userId: user.id,
    });

    res.json(apiSuccessResponse(categories.map(c => new CategoryDTO(c))));
  }
}
