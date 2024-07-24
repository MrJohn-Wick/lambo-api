import { Request, Response } from 'express';

export const profileController = {
  me(req: Request, res: Response) {
    res.json({
      user: req.user,
      profile: {
        name: "Alexander",
        birthday: "1983-10-08"
      }
    })
  }
}
