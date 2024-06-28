import express from 'express';
import { signupValidator } from '@lambo/validators/signup';
import { resultValidation } from '@lambo/validators/chains';
import { authController } from '@lambo/controllers/auth';
import userController from '@lambo/controllers/users';


const router = express.Router();

// User login 
router.post('/login', authController.singin
  // #swagger.summary = 'Login user by email, password'
);

// User logout
router.get('/logout', authController.logout
  /*
    #swagger.summary = 'User logout'
  */
);

// Register new user
router.post(
  '/register',
  signupValidator,
  resultValidation,
  userController.create
  // #swagger.summary = 'Register new user'
);

export default router;
