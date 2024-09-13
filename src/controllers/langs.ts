import langs from 'langs';
import { Request, Response } from 'express';
import { apiSuccessResponse } from '../utils/responses';

export const languagesController = {
  async list(req: Request, res: Response) {
    const fullLangs = langs.all();
    const list = fullLangs.map((l) => ({
      'code': l[1],
      'name': l.name,
      'local': l.local,
    }));

    res.json(apiSuccessResponse(list));
  }
}
