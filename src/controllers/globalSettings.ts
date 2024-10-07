import { Request, Response } from 'express';

export const globalSettingsController = {

  async get(req: Request, res: Response) {
    res.json({
      livekit_url: process.env.LIVEKIT_URL,
      google_client_id: process.env.GOOGLE_CLIENT_ID,
    });
  }
}
