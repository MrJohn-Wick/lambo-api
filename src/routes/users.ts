import express from 'express';
import userController from '@lambo/controllers/users';
import { isAuthenticated } from '@lambo/utils/auth';

const router = express.Router();

router.get('/', isAuthenticated, userController.getAll
  /* 
     #swagger.summary = 'Get users list'
     #swagger.security = [{
       "bearerAuth": []
     }]
  */
);

router.get('/:id', isAuthenticated, userController.getOne
  /*
    #swagger.summary = 'Get user by ID'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// create new user
router.post('/', isAuthenticated, userController.create
  /*
    #swagger.summary = 'Create new user '
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// update existing user
router.patch('/:id', isAuthenticated, userController.update
  /*
    #swagger.summary = 'Update existing user'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

// delete existing user
router.delete('/:id', isAuthenticated, userController.delete
  /*
    #swagger.summary = 'Delete user'
    #swagger.security = [{
      "bearerAuth": []
    }]
  */
);

export default router;
