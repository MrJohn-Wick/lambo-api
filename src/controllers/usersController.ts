import { User } from "@prisma/client";
import { Request, Response } from "express";
import { validationResult, ValidationError, Result } from 'express-validator';
import usersService from "../services/usersService";

const userController = {
  getAll: (req: Request, res: Response) => {
    const users: User[] = [];
    res.json({
      status: 'ok',
      data: users,
    });
  },

  getOne: (req: Request, res: Response) => {
    res.json({})
  },

  create: async (req: Request, res: Response) => {
    const result: Result<ValidationError> = validationResult(req);
    if(result.array().length) {
      res.status(400).json({ status: "error", errors: result.array() });  
    }
    const { body } = req;
    try {
      const createdUser = await usersService.create(body);
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

  update: (req: Request, res: Response) => {

  },
  delete: (req: Request, res: Response) => {

  }
}

export default userController;