import express from 'express';
import userController from '@lambo/controllers/users';
import { isAuthorized } from '@lambo/utils/auth';
import { signupValidator } from '@lambo/validators/signup';
import { resultValidation } from '@lambo/validators/chains';
import { authController } from '@lambo/controllers/auth';

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
router.get('/', isAuthorized, userController.getAll);

// Register new user
router.post(
  '/signup',
  signupValidator,
  resultValidation,
  userController.create
);

router.post('/signin', authController.singin);

router.get('/logout', isAuthorized, authController.logout);

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
router.get('/:id', isAuthorized, userController.getOne);

// create new user
router.post('/', isAuthorized, userController.create);

// update existing user
router.patch('/:id', isAuthorized, userController.update);

// delete existing user
router.delete('/:id', isAuthorized, userController.delete);

export default router;
