import passport from 'passport';
import { Router } from 'express';
import { subscriptionController } from '../controllers/subscribtion';

export const subcriptionsRouter = Router();

subcriptionsRouter.post(
  /* 
    #swagger.tags = ['Subscriptions']
    #swagger.summary = 'Create subscriptions with Author and Subscriber.'
    #swagger.description = '-'
    #swagger.parameters['body'] = {
      in: 'body',
      description: '-',
      schema: {}
    } 
    #swagger.security = [{
      "apiKeyAuth": []
    }]

  */
  '/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.create
);

/**
 * 
 */
subcriptionsRouter.get(
  /* 
    #swagger.tags = ['Subscriptions']
    #swagger.summary = 'Getting subscriptions by userId'
    #swagger.description = '-'
    #swagger.parameters['body'] = {
      in: 'body',
      description: '-',
      schema: {}
    } 
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/:userId/subscriptions',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.get
);
