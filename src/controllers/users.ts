import { Prisma, User } from "@prisma/client";
import { Request, Response } from "express";
import { validationResult, ValidationError, Result } from 'express-validator';
import usersService from "@lambo/services/users";

const userController = {
  getAll: async (req: Request, res: Response) => {
    const users = await usersService.getAll();
    res.json({
      status: 'ok',
      data: users,
    });
  },

  getOne: async (req: Request, res: Response) => {
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
    const result: Result<ValidationError> = validationResult(req);
    if(result.array().length) {
      res.status(400).json({ status: "error", errors: result.array() });  
    }
    try {
      const createdUser = await usersService.create(req.body);
      res.json({
        status: 'Ok',
        date: createdUser,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        errors: [error]
      });
    }
  },

  update: async (req: Request, res: Response) => {
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
    const id = req.params.id;
    try {
      await usersService.delete(id);
      res.json({
        status: 'Ok',
        date: null,
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        errors: [error]
      });
    }

  }
}

export default userController;