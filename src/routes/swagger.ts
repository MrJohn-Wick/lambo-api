import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger-output.json';


export const swaggerDocs = (app: Express, port: number) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger docs available');
};
