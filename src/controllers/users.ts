import { Request, Response } from 'express';
import { getUserById, getUserByUsername, getUserMetrics, getUsers } from '../repositories/users';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getProfileByUserId } from '../repositories/profile';
import { UserDTO } from '../dtos/user';
import { ProfileDTO } from '../dtos/profile';
import { ErrorMessages } from '../constants';
import { getStreams } from '../repositories/streams';
import { StreamDTO } from '../dtos/stream';
import { getGallery } from '../repositories/galleries';
import { getS3PublicKey } from '../utils/s3';


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
      return res.status(404).json(apiErrorResponse(ErrorMessages.userNotFound));
    }

    const profile = await getProfileByUserId(user.id);
    let avatar = null;
    if (profile && profile.gallery) {
      const gallery = await getGallery(profile.gallery.id);
      const key = gallery?.items.length ? gallery?.items[0].key : null;
      if (key) {
        avatar = getS3PublicKey(key);
      }
    }

    let userDto: UserDTO = {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      password: !!user.passwordHash,
      profile: profile ? new ProfileDTO({avatar, ...profile}): null,
      metrics: null,
      settings: null,
    };

    if (modes.includes('metrics')) {
      userDto.metrics = await getUserMetrics(user.id);
    }

    if (modes.includes('settings')) {
    }

    return res.json(apiSuccessResponse(userDto));
  },

  async getByUsername(req: Request, res: Response) {
    const username = req.params.username;
    const { mode } = req.query as { mode?: string };
    const modes = mode ? mode.split(',') : [];

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.userNotFound));
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
  },

  async getUserStreams(req: Request, res: Response) {
    const id = req.params.id;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.userNotFound));
    }

    const streams = await getStreams({
      user_id: id
    });

    return res.json(apiSuccessResponse(streams.map(s => new StreamDTO(s))));
  }
}
