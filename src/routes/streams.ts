import { Router } from 'express';
import passport from 'passport';
import { streamsController } from '../controllers/streams';

export const streamsRouter = Router();

streamsRouter.get(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'List of all streams'
    #swagger.description = 'Returt list of all streams'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Query limit (optional)',
      type: 'number'
    } 
  */
  '/',
  passport.authenticate('bearer', { session:false }),
  streamsController.list
);

streamsRouter.post(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'Create new stream'
    #swagger.description = 'Create new stream'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Stream values',
      schema: {
        $title: 'Stream title',
        $user_id: 'id',
        $categories: [],
        $preview: 'url'
      }
    } 
  */
  '/',
  passport.authenticate('bearer', { session:false }),
  streamsController.create
);

streamsRouter.get(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'Recomended streams'
    #swagger.description = 'Return recomended stream for current user'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/recomended',
  passport.authenticate('bearer', { session:false }),
  streamsController.recomended
);

streamsRouter.get(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'Get stream info'
    #swagger.description = 'Returt stream info'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Stream id',
      type: 'string'
    } 
  */
  '/:id',
  passport.authenticate('bearer', { session:false }),
  streamsController.get
);

streamsRouter.patch(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'Edit stream'
    #swagger.description = 'Edit stream info and return them'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Stream id',
      type: 'string'
    } 
  */
  '/:id/edit',
  passport.authenticate('bearer', { session:false }),
  streamsController.edit
);

streamsRouter.get(
  /* 
    #swagger.tags = ['Streams']
    #swagger.summary = 'Get stream token'
    #swagger.description = 'Get participant tocken'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Stream id',
      type: 'string'
    } 
  */
  '/:id/token',
  passport.authenticate('bearer', { session:false }),
  streamsController.token
);
