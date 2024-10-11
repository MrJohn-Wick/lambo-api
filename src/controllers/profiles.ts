import { Request, Response } from 'express';
import { apiSuccessResponse } from '../utils/responses';
import { getProfiles } from '../repositories/profile';
import { ProfileExploreDTO } from '../dtos/profile';

export const profilesController = {

  async listExplore(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search;
    const sort = req.query.sort;

    const profiles = await getProfiles({
      limit,
      search,
      sort,
      gallery: true,
    });

    res.json(apiSuccessResponse(profiles.map(p => new ProfileExploreDTO(p))));
  }

}