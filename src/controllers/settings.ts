import z from 'zod';
import { Request, Response } from 'express';
import { getUserById } from '../repositories/users';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getSettings, setSetting } from '../repositories/settings';
import { UserSettingsSchema } from '../schemas/settings';

export const settingsController = {
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json(apiErrorResponse('User not found'));
    }

    const settings = await getSettings(user.id);
    return res.json(apiSuccessResponse(settings));
  },

  async set(req: Request, res: Response) {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json(apiErrorResponse('User not found'));
    }

    const validatedValues = UserSettingsSchema.safeParse(req.body);
    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.path+":"+e.message);
      return res.status(400).json(apiErrorResponse('Invalid requiest. '+messages.join('. ')));
    }

    for(const key in validatedValues.data) {
      const value = validatedValues.data[key as keyof z.infer<typeof UserSettingsSchema>];
      setSetting(user.id, key, value ? 'true' : 'false');
    }

    res.json(apiSuccessResponse());
  },
}