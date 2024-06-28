import { Request, Response } from 'express';
import { LoginSchema } from '@lambo/schemas/login';

export const authController = {
  singin: async (req: Request, res: Response) => {
    const validatedFields = LoginSchema.safeParse(req.body);
    if (!validatedFields.success) {
      return {
        error: "Invalid fields"
      }
    }

    const { email, password } = validatedFields.data;
    return {
      success: "You are logged in"
    }
  },

  logout: async (req: Request, res: Response) => {
    // console.log('Logout');
    // const token = getToken(req);
    // if (token) await sessionsService.remove(token);

    // res.json({
    //   status: 'ok',
    // });
  },
};
