import express from 'express';
import userController from '@lambo/controllers/users';
import { isAuthorized } from '@lambo/utils/auth';
import { signupValidator } from '@lambo/validators/signup';
import { resultValidation } from '@lambo/validators/chains';
import { authController } from '@lambo/controllers/auth';

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

router.post('/signin', authController.singin
  // #swagger.summary = 'Login user by email, password'
);

router.get('/logout', isAuthorized, authController.logout
  /*
    #swagger.summary = 'User logout'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

router.get('/:id', isAuthorized, userController.getOne
  /*
    #swagger.summary = 'Get user by ID'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// create new user
router.post('/', isAuthorized, userController.create
  /*
    #swagger.summary = 'Create new user '
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// update existing user
router.patch('/:id', isAuthorized, userController.update
  /*
    #swagger.summary = 'Update existing user'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// delete existing user
router.delete('/:id', isAuthorized, userController.delete
  /*
    #swagger.summary = 'Delete user'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

export default router;
