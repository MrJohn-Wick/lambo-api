import { Router } from 'express';
import { globalSettingsController } from '../controllers/globalSettings';

export const globalSettingsRouter = Router();

globalSettingsRouter.get(
  /* 
    #swagger.tags = ['Global settings']
    #swagger.summary = 'Return settings for apps'
    #swagger.description = 'Return settings for apps'
  */
  '/',
  globalSettingsController.get
);
