import { Router } from 'express';
import passport from 'passport';
import { categoriesController } from '../controllers/categories';

export const categoriesRouter = Router();

categoriesRouter.get(
  /* 
    #swagger.tags = ['Categories']
    #swagger.summary = 'Return all categories'
    #swagger.description = 'Return all categories'
  */
  '/',
  // passport.authenticate('bearer', { session: false }),
  categoriesController.list
);
