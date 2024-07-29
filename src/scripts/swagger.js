const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000',
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
