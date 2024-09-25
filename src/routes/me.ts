import passport from 'passport';
import { Router } from 'express';
import { profileController } from '../controllers/profile';
import { subscriptionController } from '../controllers/subscribtion';
import { categoriesController } from '../controllers/categories';
import { uploadAvatarController } from '../controllers/upload';

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
  '/subscriptions',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.getForCurrentUser
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

meRouter.post(
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Edit user profile'
    #swagger.description = 'Edit user profile, all parameters are optional'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User credentials',
      schema: {
        $username: '',
        $firstname: '',
        $lastname: '',
        $birthday: '',
        $location: '',
        $categories: ['id1', 'id2'],
        $avatar: 's3 key'
      }
    } 
  */
  '/update',
  passport.authenticate('bearer', { session: false }),
  profileController.update
);


meRouter.post(
  /* 
    #swagger.tags = ['User']
    #swagger.summary = 'Update user password'
    #swagger.description = 'update user password'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User credentials',
      schema: {
        $password: '',
      }
    } 
  */
  '/password',
  passport.authenticate('bearer', { session: false }),
  profileController.password
);

meRouter.post(
  /* 
  #swagger.tags = ['User']
  #swagger.summary = 'Upload user avatar'
  #swagger.description = ''
  #swagger.security = [{
    "apiKeyAuth": []
  }]
  #swagger.parameters['avatar'] = {
    in: 'formData',
    type: 'file',
    required: 'true',
    description: 'Some description...',
  } 
  */
  '/avatar',
  passport.authenticate('bearer', { session: false }),
  uploadAvatarController
)
