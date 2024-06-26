import bcrypt from 'bcrypt';
import { Prisma, User } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { validationResult, ValidationError, Result } from 'express-validator';
import usersService from "@lambo/services/users";

const userController = {
  getAll: async (req: Request, res: Response) => {
    console.info("Geta all users");
    const users = await usersService.getAll();
    res.json({
      status: 'ok',
      data: users,
    });
  },

  getOne: async (req: Request, res: Response) => {
    console.info("Get user by id");
    const user = await usersService.get(req.params.id);
    if (user) {
      res.json({
        status: 'ok',
        data: user
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'User not found'
      })
    }
  },

  create: async (req: Request, res: Response) => {
    console.info("Creating user");
    const result: Result<ValidationError> = validationResult(req);
    if(result.array().length) {
      res.status(400).json({ status: "error", errors: result.array() });
      return;
    }
    try {
      console.log('Start user service');
      const createdUser = await usersService.create(req.body);
      if (createdUser) {
        res.json({
          status: 'Ok',
          date: createdUser,
        });
      } else {
        res.status(401).json({
          status: 'error',
          error: ['User exists']
        });
      }
    } catch (error) {
      res.status(402).json({
        status: 'error',
        errors: [error]
      });
    }
  },

  update: async (req: Request, res: Response) => {
    console.info("Update user");
    const id = req.params.id;
    try {
      const values: Prisma.UserCreateInput = {...req.body};
      const user = await usersService.update(id, values);
      res.json({
        status: 'Ok',
        date: user,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        errors: [error]
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    console.info("Delete user");
    const id = req.params.id;
    try {
      await usersService.delete(id);
      res.json({
        status: 'Ok',
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        errors: [error]
      });
    }
  },

  singin: async (req: Request, res: Response) => {
    console.info("Sing in");
    const email = req.body.email;
    const user = await usersService.getByEmail(email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign({ user }, secret as string, { expiresIn: '1800s' })
      res.json({
        status: 'ok',
        token,
      })
    } else {
      res.json({
        status: 'error',
        error: ['Auth failed'],
      })
    }
  }
}

export default userController;