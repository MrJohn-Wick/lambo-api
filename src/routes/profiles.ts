import { Router } from 'express';
import passport from 'passport';
import { profilesController } from '../controllers/profiles';

export const profilesRouter = Router();

profilesRouter.get(
  /* 
    #swagger.tags = ['Profiles']
    #swagger.summary = 'Users profiles'
    #swagger.description = 'Returt list of profiles'
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
    profilesController.listExplore
);