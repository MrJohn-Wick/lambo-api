import { Request, Response } from 'express';
import { createStream, editStream, getStream, getStreams } from '../repositories/streams';
import { StreamCreateSchema, StreamEditSchema } from '../schemas/streams';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';

export const streamsController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const streams = await getStreams(limit);

    res.json(apiSuccessResponse(streams));
  },

  async create(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const validatedData = StreamCreateSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.json(apiErrorResponse('Invalid requiest'));
    }

    const { title, user_id, categories, preview } = validatedData.data;
    // TODO: when added roles
    // if(user_id && user.role == 'admin') { createStreamForUser }
    const stream = await createStream(user.id, title, categories, preview);
    res.json(apiSuccessResponse(stream));
  },

  async get(req: Request, res: Response) {
    const streamId = req.params.id;

    if (streamId) {
      const stream = await getStream(streamId);
      if (stream) {
        return res.json(apiSuccessResponse(stream));
      }
    }

    return res.json(apiErrorResponse('Stream not found'));
  },

  async edit(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const validatedData = StreamEditSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.json(apiErrorResponse('Invalid requiest'));
    }

    const stream = await editStream(streamId, validatedData.data);
    res.json(apiSuccessResponse(stream));
  },

  async delete(req: Request, res: Response) {},

  async recomended(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const streams = await getStreams(5); // TODO: there is no criteria.

    res.json(apiSuccessResponse(streams));
  },
}
