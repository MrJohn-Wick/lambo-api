import { Request, Response } from 'express';
import { createStream, editStream, getStream, getStreams, getStreamToken } from '../repositories/streams';
import { StreamCreateSchema, StreamEditSchema } from '../schemas/streams';

export const streamsController = {
  async list(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const streams = await getStreams(limit);

    res.json({
      success: true,
      payload: streams
    });
  },

  async create(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Premission denied");

    const validatedData = StreamCreateSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.json({
        success: false,
        error: {
          message: validatedData.error,
        }
      })
    }
    const { title, user_id, categories, preview } = validatedData.data;
    // TODO: when added roles
    // if(user_id && user.role == 'admin') { createStreamForUser }

    res.json({
      success: true,
      payload: await createStream(user.id, title, categories, preview),
    });
  },

  async get(req: Request, res: Response) {
    const streamId = req.params.id;

    if (streamId) {
      const stream = await getStream(streamId);
      if (stream) {
        return res.json({
          success: true,
          payload: stream
        });
      }
    }

    return res.status(404).json({
      success: false,
      error: {
        message: "Not found"
      }
    });
  },

  async edit(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const validatedData = StreamEditSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.json({
        success: false,
        error: {
          message: validatedData.error,
        }
      })
    }

    res.json({
      success: true,
      item: await editStream(streamId, validatedData.data),
    });

  },

  async delete(req: Request, res: Response) {},

  async recomended(req: Request, res: Response) {
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const streams = await getStreams(5); // TODO: there is no criteria.

    res.json({
      success: true,
      payload: streams
    });
  },

  async token(req: Request, res: Response) {
    const user = req.user;
    const streamId = req.params.id;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const token = await getStreamToken(streamId, user.id);
    if (token) {
      return res.json({
        success: true,
        payload: token,
      })
    }

    res.json({
      success: false,
      error: {
        message: "Can't generate token",
      } 
    })
  }
}
