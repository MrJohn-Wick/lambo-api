import passport from 'passport';
import { Router } from 'express';
import { usersController } from '../controllers/users';
import { profileController } from '../controllers/profile';
import { subscriptionController } from '../controllers/subscribtion';

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

usersRouter.get(
  /* 
    #swagger.tags = ['User']
    #swagger.description = 'Need to pass user access_token in Authorization header'
    #swagger.summary = 'Get current user profile'
    #swagger.produces = ['application/json']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/me',
  passport.authenticate('bearer', { session: false }),
  profileController.me
);

usersRouter.get(
  '/users/available-for-call',
  passport.authenticate('bearer', { session: false }),
  profileController.availableForCall
);

usersRouter.post(
  '/users/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.create
);

usersRouter.get(
  '/users/:userId/subscriptions',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.get
);
