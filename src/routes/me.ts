import passport from 'passport';
import { Router } from 'express';
import { profileController } from '../controllers/profile';
import { subscriptionController } from '../controllers/subscribtion';

export const meRouter = Router();

meRouter.get(
  /* 
    #swagger.tags = ['User']
    #swagger.description = 'Need to pass user access_token in Authorization header'
    #swagger.summary = 'Get current user profile'
    #swagger.produces = ['application/json']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/',
  passport.authenticate('bearer', { session: false }),
  profileController.me
);

meRouter.get(
  /* 
    #swagger.tags = ['User']
  */
  '/available-for-call',
  passport.authenticate('bearer', { session: false }),
  profileController.availableForCall
);

meRouter.post(
  /* 
    #swagger.tags = ['User']
  */
  '/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.create
);
