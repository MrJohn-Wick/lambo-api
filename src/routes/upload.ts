import { Router } from 'express';
import { uploadAvatarController } from '../controllers/upload';

export const uploadRouter = Router();

uploadRouter.post(
  /* 
  #swagger.tags = ['Uploads']
  #swagger.summary = 'Upload user avatar'
  #swagger.description = ''
  #swagger.parameters['avatar'] = {
    in: 'formData',
    type: 'file',
    required: 'true',
    description: 'Some description...',
  } 
  */
  '/avatar',
  uploadAvatarController
);
