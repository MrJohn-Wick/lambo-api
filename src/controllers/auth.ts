import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'local',
      (err:any, user:any, info:any) => {
        if (err)
          return next(err);
        if (!user) {
          res.status(401).json({
            success: false,
            message: info.message,
          });
        }
        req.login(user, { session: true }, async (error) => {
          if (error) return next(error);
          return res.json({
            success: true,
          })
        });
    }
    )(req, res, next);
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      return {
        success: "ok",
      }
    });
  },
};
