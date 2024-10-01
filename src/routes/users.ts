import passport from 'passport';
import { Router } from 'express';
import { usersController } from '../controllers/users';
import { subscriptionController } from '../controllers/subscribtion';
import { settingsController } from '../controllers/settings';

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
    #swagger.summary = 'Get user'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['mode'] = {
      in: 'query',
      description: 'default or metrics',
      type: 'string'
    } 
  */
  '/:id',
  passport.authenticate('bearer', { session: false }),
  usersController.get
);

usersRouter.get(
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get user by username'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['mode'] = {
      in: 'query',
      description: 'default or metrics',
      type: 'string'
    } 
  */
  '/username/:username',
  passport.authenticate('bearer', { session: false }),
  usersController.getByUsername
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

usersRouter.get(
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get user settings'
    #swagger.description = ''
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/:id/settings',
  passport.authenticate('bearer', { session: false }),
  settingsController.get
);

usersRouter.put(
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Set user settings'
    #swagger.description = ''
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'one or many user settings',
      schema: {
        $notifications: false,
        $dark: false,
        $tfa: false,
        $incognito: false,
      }
    } 

  */
  '/:id/settings',
  passport.authenticate('bearer', { session: false }),
  settingsController.set
);
