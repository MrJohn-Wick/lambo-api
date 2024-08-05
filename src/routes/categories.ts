import { Router } from 'express';
import passport from 'passport';
import { categoriesController } from '../controllers/categories';

export const categoriesRouter = Router();

// use authorization for all endpoints
// categoriesRouter.use(passport.authenticate('bearer', { session: false }));

categoriesRouter.get(
  '/',
  categoriesController.list
);
