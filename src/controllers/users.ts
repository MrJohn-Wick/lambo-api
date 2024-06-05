import { User } from "@prisma/client";
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

  getOne: (req: Request, res: Response) => {
    res.json({})
  },

  create: async (req: Request, res: Response) => {
    const {email, phone} = req.body;
    console.log(req.body);
    console.log(email, phone);
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

  update: (req: Request, res: Response) => {

  },
  delete: (req: Request, res: Response) => {

  }
}

export default userController;