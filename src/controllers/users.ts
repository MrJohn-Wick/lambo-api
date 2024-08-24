import { Request, Response } from 'express';
import { getUsers } from '../repositories/users';
import { apiSuccessResponse } from '../utils/responses';

export const usersController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const users = getUsers(limit);

    res.json(apiSuccessResponse(users));
  }
}
