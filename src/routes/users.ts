import passport from 'passport';
import { Router } from 'express';
import { usersController } from '../controllers/users';

export const usersRouter = Router();

usersRouter.get(
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'list of users'
    #swagger.description = 'Returt list of users'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Query limit',
      type: 'number'
    } 
  */
  '/',
  passport.authenticate('bearer', { session: false }),
  usersController.list
);
