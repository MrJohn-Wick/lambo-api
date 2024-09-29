import { Request, Response } from 'express';
import { getUserById, getUserMetrics, getUsers } from '../repositories/users';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getProfileByUserId } from '../repositories/profile';
import { UserDTO } from '../dtos/user';
import { ProfileDTO } from '../dtos/profile';


export const usersController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const users = getUsers(limit);

    res.json(apiSuccessResponse(users));
  },

  async get(req: Request, res: Response) {
    const userId = req.params.id;
    const { mode } = req.query as { mode?: string };
    const modes = mode ? mode.split(',') : [];

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json(apiErrorResponse("User not fount"));
    }

    const profile = await getProfileByUserId(user.id);

    let userDto: UserDTO = {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      password: !!user.passwordHash,
      profile: new ProfileDTO(profile),
      metrics: null,
      settings: null,
    };

    if (modes.includes('metrics')) {
      userDto.metrics = await getUserMetrics(user.id);
    }

    if (modes.includes('settings')) {
    }

    return res.json(apiSuccessResponse(userDto));
  }
}
