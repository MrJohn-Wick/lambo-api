import { RegisterSchema } from '@lambo/schemas/register';
import { usersService } from '@lambo/services/users';
import { Prisma } from '@prisma/client';
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
      if (err)
        return next(err);
      return {
        success: "ok",
      }
    });
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    const validatedValues = RegisterSchema.safeParse(req.body);
    if (validatedValues.success) {
      try {
        await usersService.create({
          email: validatedValues.data.email,
          password: validatedValues.data.password
        });
        res.json({
          success: true,
          message: "User created"
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          res.json({
            success: false,
            message: "Email is exist",
          });
        }
        next(error);
      }
    } else {
      res.json({
        success: false,
        message: 'Invalid parameters',
      });
    }
  },
};
