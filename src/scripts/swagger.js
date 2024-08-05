const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv-flow');


dotenv.config();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  basePath: process.env.SWAGGER_BASEPATH || '/',
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      value: 'Bearer <access_token>',
      description: 'Bearer token from /oauth/token'
    }
  },
};

const outputFile = '../../swagger-doc.json';
const routes = ['src/index.ts'];

swaggerAutogen(outputFile, routes, doc);
