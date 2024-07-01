import express from 'express';
import userController from '@lambo/controllers/users';
import { signupValidator } from '@lambo/validators/signup';
import { resultValidation } from '@lambo/validators/chains';
import { authController } from '@lambo/controllers/auth';
import { isAuthenticated } from '@lambo/utils/auth';

const router = express.Router();

router.get('/', isAuthorized, userController.getAll
  /* 
     #swagger.summary = 'Get users list'
     #swagger.security = [{
       "bearerAuth": []
     }]
  */
);

// Register new user
router.post(
  '/signup',
  signupValidator,
  resultValidation,
  userController.create
  // #swagger.summary = 'Register new user'
);

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
router.get('/:id', isAuthenticated, userController.getOne);

// create new user
router.post('/', isAuthenticated, userController.create);

// update existing user
router.patch('/:id', isAuthenticated, userController.update);

// delete existing user
router.delete('/:id', isAuthenticated, userController.delete);
