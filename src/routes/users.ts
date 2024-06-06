import express from "express";
import { checkSchema } from 'express-validator';
import bodyParser from 'body-parser';
import userController from "@lambo/controllers/users";
import { schemaUserCreate } from "@lambo/validators/usersSchemas";

const router = express.Router();
const jsonParser = bodyParser.json();

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

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "ID of the user"
 *         schema:
 *           type: integer
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: "UUID of the user"
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     date_of_birth:
 *                       type: string
*/
router.get('/:id', userController.getOne);

// create new user
router.post(
  '/',
  jsonParser,
  checkSchema(schemaUserCreate),
  userController.create
);

// update existing user 
router.patch(
  '/:id',
  jsonParser,
  userController.update
);

// delete existing user
router.delete(
  '/:id',
  userController.delete
);

export default router;
