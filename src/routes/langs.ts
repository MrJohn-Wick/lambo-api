import { Router } from 'express';
import { languagesController } from '../controllers/langs';

export const languagesRouter = Router();

languagesRouter.get(
  /* 
    #swagger.tags = ['Global settings']
    #swagger.summary = 'Return all languages'
    #swagger.description = 'Return all languages'
  */
  '/',
  languagesController.list
);
