import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import usersService from "@lambo/services/users";
import { sessionsService } from '@lambo/services/sessions';

export const authController = {
  singin: async (req: Request, res: Response) => {
    console.info("Sing in");
    const email = req.body.email;
    const user = await usersService.getByEmail(email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign({ user }, secret as string, { expiresIn: '1800s' })
      await sessionsService.create(token, user);
      res.json({
        status: 'ok',
        token,
      })
    } else {
      res.status(400).json({
        status: 'error',
        error: ['Auth failed'],
      })
    }
  }
}