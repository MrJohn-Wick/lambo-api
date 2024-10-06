import { Request, Response } from 'express';
import { createStream, createStreamRoom, editStream, getStream, getStreamBySlug, getStreams, getStreamToken } from '../repositories/streams';
import { StreamCreateSchema, StreamEditSchema } from '../schemas/streams';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { moveObjectToStreamsCoves } from '../utils/s3';
import { getProfileByUserId } from '../repositories/profile';
import { ErrorMessages } from '../constants';
import { getCategoriesByIds } from '../repositories/categories';

export const streamsController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const streams = await getStreams(limit);

    res.json(apiSuccessResponse(streams));
  },

  async create(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

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
      const categories = await getCategoriesByIds(streamData.categories);
      if (categories.length !== streamData.categories.length) {
        return res.status(400).json(apiErrorResponse(ErrorMessages.wrongCategories));
      }

      const stream = await createStream(streamData);
      return res.json(apiSuccessResponse(stream));
    } catch (e) {
      console.log(e);
      return res.status(500).send(apiErrorResponse(ErrorMessages.unknown));
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

  async getBySlug(req: Request, res: Response) {
    const slug = req.params.slug;

    if (slug) {
      const stream = await getStreamBySlug(slug);
      if (stream) {
        return res.json(apiSuccessResponse(stream));
      }
    }

    return res.status(404).json(apiErrorResponse(ErrorMessages.streamNotFound));
  },

  async edit(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

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
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const streams = await getStreams(5); // TODO: there is no criteria.

    res.json(apiSuccessResponse(streams));
  },

  async token(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

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
