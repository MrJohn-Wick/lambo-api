import { Request, Response } from 'express';
import { createStream, createStreamRoom, editStream, getStream, getStreams, getStreamToken } from '../repositories/streams';
import { StreamCreateSchema, StreamEditSchema } from '../schemas/streams';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { moveObjectToStreamsCoves } from '../utils/s3';
import { getProfileByUserId } from '../repositories/profile';
import { ErrorMessages } from '../constants';

export const streamsController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const streams = await getStreams(limit);

    res.json(apiSuccessResponse(streams));
  },

  async create(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Premission denied");

    // TODO: User roles

    const validatedData = await StreamCreateSchema.safeParseAsync(req.body);
    if (!validatedData.success) {
      const messages = validatedData.error.errors.map((e) => e.path+":"+e.message);
      return res.status(400).json(apiErrorResponse(`${ErrorMessages.invalidRequest} ${messages.join('. ')}`));
    }
    if (validatedData.data.cover) {
      const fileObject = await moveObjectToStreamsCoves(validatedData.data.cover);
      if (fileObject) {
          validatedData.data.cover = fileObject.uri;
      }
    }
    const streamData = { uid: user.id, ...validatedData.data};
    try {
      const stream = await createStream(streamData);

      res.json(apiSuccessResponse(stream));
    } catch (e) {
      res.status(500).send();
    }
  },

  async get(req: Request, res: Response) {
    const streamId = req.params.id;

    if (streamId) {
      const stream = await getStream(streamId);
      if (stream) {
        return res.json(apiSuccessResponse(stream));
      }
    }

    return res.status(404).json(apiErrorResponse(ErrorMessages.streamNotFound));
  },

  async edit(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const validatedData = StreamEditSchema.safeParse(req.body);
    if (!validatedData.success) {
      const messages = validatedData.error.errors.map((e) => e.path+":"+e.message);
      return res.status(400).json(apiErrorResponse(`${ErrorMessages.invalidRequest} ${messages.join('. ')}`));
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

  async token(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) throw("Does'n have user after auth middleware!!!");

    let stream = await getStream(streamId);
    if (!stream) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.streamNotFound));
    }

    const profile = await getProfileByUserId(user.id);
    if (!profile?.username) {
      return res.status(406).json(apiErrorResponse(ErrorMessages.tokenNotGenerated));
    }

    if (!stream.room && stream.user_id == user.id) {
      if (!(await createStreamRoom(stream)))
        return res.status(406).json(apiErrorResponse(ErrorMessages.roomNotCreated));
    }
  
    const token = await getStreamToken(streamId, user.id);
    if (token) {
      return res.json(apiSuccessResponse(token));
    }

    res.status(406).json(apiErrorResponse(ErrorMessages.streamInactive));
  }
}
