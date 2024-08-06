import passport from 'passport';
import { Router } from 'express';
import { profileController } from '../controllers/profile';
import { subscriptionController } from '../controllers/subscribtion';
import { categoriesController } from '../controllers/categories';

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
    #swagger.summary = 'Get users available for call to current user'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/available-for-call',
  passport.authenticate('bearer', { session: false }),
  profileController.availableForCall
);

meRouter.post(
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Subscribe current user to another'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.create
);

meRouter.get(
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Get categories for current user'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
    '/categories',
  passport.authenticate('bearer', { session: false }),
  categoriesController.userCategories
);
