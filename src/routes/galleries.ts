import { Router } from 'express';
import passport from 'passport';
import { GalleriesController } from '../controllers/galleries';

export const galleriesRouter = Router();


galleriesRouter.get(
  /* 
  #swagger.tags = ['Galleries']
  #swagger.summary = 'Get gallery'
  #swagger.description = ''
  #swagger.security = [{
    "apiKeyAuth": []
  }]
  */
  '/:id',
  passport.authenticate('bearer', { session: false }),
  GalleriesController.get
)

galleriesRouter.post(
  /* 
  #swagger.tags = ['Galleries']
  #swagger.summary = 'Upload images to the gallery'
  #swagger.description = ''
  #swagger.consumes = ['multipart/form-data'] 
  #swagger.security = [{
    "apiKeyAuth": []
  }]
  #swagger.parameters['images'] = {
    in: 'formData',
    type: 'array',
    required: 'true',
    description: 'Some description...',
    collectionFormat: 'multi',
    items: { type: 'file' }
  } 
  */
  '/:id/upload',
  passport.authenticate('bearer', { session: false }),
  GalleriesController.upload
)

galleriesRouter.post(
  /* 
  #swagger.tags = ['Galleries']
  #swagger.summary = 'Delete image'
  #swagger.description = ''
  #swagger.security = [{
    "apiKeyAuth": []
  }]
  */
  '/images/:id/delete',
  passport.authenticate('bearer', { session: false }),
  GalleriesController.deleteImage
)
