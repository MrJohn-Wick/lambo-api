import passport from 'passport';
import { Router } from 'express';
import { usersController } from '../controllers/users';
import { subscriptionController } from '../controllers/subscribtion';

export const usersRouter = Router();

usersRouter.get(
  /* 
    #swagger.tags = ['Users']
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
    #swagger.tags = ['Users']
    #swagger.security = [{
      "apiKeyAuth": []
    }]

  */
  '/:userId/subscriptions',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.get
);

usersRouter.get(
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Subscribe to user'
    #swagger.description = ''
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
    '/:id/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.subscribeToUser
)