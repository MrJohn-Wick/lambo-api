import { Request, Response } from 'express';

export const profileController = {
  me(req: Request, res: Response) {
    res.json({
      user: req.user, // current user
      // @TODO: MOCK data
      profile: {
        name: "Alexander",
        birthday: "1983-10-08"
      }
    })
  },
  availableForCall(req: Request, res: Response) {
    res.json({
      user: req.user, // current user
    })
  }
}
