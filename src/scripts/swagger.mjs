import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API documentation',
    description: '',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Bearer JWT token getting from /user/signin'
    },
  }
}

const outputFile = '../../swagger-output.json';
const routes = ['../index.ts'];

swaggerAutogen()(outputFile, routes, doc);
