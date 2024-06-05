import express from "express";
import { checkSchema } from 'express-validator';
import userController from "@lambo/controllers/users";
import { schemaUserCreate } from "@lambo/validators/usersSchemas";

const router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
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
