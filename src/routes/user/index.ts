import express, { Request, Response } from "express";
import userController from "../../controllers/usersController";
import { checkSchema } from 'express-validator';
import { schemaUserCreate } from "../../validators/usersSchemas";

const router = express.Router();

// Get all users
router.get('/', userController.getAll);

// Get one user
router.get('/:id', userController.getOne);

// create new user
router.post(
  '',
  checkSchema(schemaUserCreate),
  userController.create
);

// update existing user 
router.patch('/:id', userController.update);

// delete existing user
router.delete('/:id', userController.delete);

export default router;
